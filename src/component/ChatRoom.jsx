import React, { useState, useEffect, useMemo } from "react";

const ChatRoom = ({ selectedUser, socket }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(null); // Store who is typing
  const currentUser = JSON.parse(localStorage.getItem("CurrentUser"));
  const userList = JSON.parse(localStorage.getItem("userList"));

  const receiver = useMemo(
    () => userList.find((user) => user._id === selectedUser),
    [selectedUser]
  );

  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    socket.on("update_online_status", (users) => {
      setOnlineUsers(users); // Update the list of online users
    });

    socket.on("user_typing", ({ userId }) => {
      if (userId !== currentUser._id) {
        setTypingUser(userId); // Set who is typing
        setIsTyping(true); // Show typing indicator
      }
    });

    socket.on("user_stopped_typing", ({ userId }) => {
      if (userId === typingUser) {
        setIsTyping(false); // Hide typing indicator when they stop typing
        setTypingUser(null); // Reset typing user
      }
    });

    return () => {
      socket.off("update_online_status");
      socket.off("user_typing");
      socket.off("user_stopped_typing");
    };
  }, [socket, currentUser._id, typingUser]);

  const isOnline = onlineUsers.includes(selectedUser);

  useEffect(() => {
    const fetchChatHistory = async () => {
      if (receiver) {
        const room = [currentUser._id, receiver._id].sort().join("_");

        try {
          const response = await fetch(
            `https://chatbackend-three.vercel.app/messages/${room}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          if (response.ok) {
            const { messages: chatHistory } = await response.json();
            setMessages(chatHistory);
          } else {
            console.error("Failed to fetch messages:", response.statusText);
          }
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      }
    };

    fetchChatHistory();
  }, [receiver]);

  useEffect(() => {
    if (receiver) {
      const room = [currentUser._id, receiver._id].sort().join("_");

      socket.emit("join_room", { room });

      socket.on("receive_message", (data) => {
        setMessages((prev) => [...prev, data]);
      });
    }

    return () => {
      socket.off("receive_message");
    };
  }, [receiver, socket]);

  const sendMessage = () => {
    if (message.trim() !== "") {
      const room = [currentUser._id, receiver._id].sort().join("_");

      socket.emit("send_message", {
        room,
        sender: currentUser._id,
        receiver: receiver._id,
        message,
      });

      setMessages((prev) => [...prev, { sender: currentUser._id, message }]);
      setMessage("");
    }
  };

  return (
    <div className="max-w-md mx-5 border rounded-lg shadow-lg bg-white p-4">
      <div
        className={`flex flex-col justify-start items-start bg-purple-500 text-white font-bold text-lg ${
          isOnline ? "pt-2" : "py-2"
        } px-4 rounded-t-lg text-center`}
      >
        {receiver?.name || "Unknown"}
        {isOnline ? (
          <div className="flex flex-row justify-center items-center gap-2 mb-1">
            <span className="inline-block bg-green-300 h-2 w-2 rounded-lg"></span>
            <span className="text-white font-normal text-sm">Online</span>
          </div>
        ) : (
          <div className="flex flex-row justify-center items-center gap-2 mb-1">
            <span className="inline-block bg-red-500 h-2 w-2 rounded-lg"></span>
            <span className="text-white font-normal text-sm">Offline</span>
          </div>
        )}
      </div>

      <div
        className="flex flex-col space-y-2 overflow-y-auto max-h-80 py-3 px-4 bg-gray-50"
        style={{ scrollbarWidth: "thin", scrollbarColor: "purple lightgray" }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === currentUser._id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`${
                msg.sender === currentUser._id
                  ? "bg-purple-500 text-white"
                  : "bg-gray-200 text-black"
              } px-3 py-2 rounded-lg shadow`}
            >
              {msg.message}
            </div>
          </div>
        ))}

        {isTyping && typingUser && (
          <div className="text-gray-500 text-sm italic mt-2">
            {typingUser !== currentUser._id && "User is typing..."}
          </div>
        )}
      </div>

      <div className="flex items-center mt-3 space-x-3">
        <input
          type="text"
          value={message}
          onFocus={() => {
            // setIsTyping(true);
            const room = [currentUser._id, receiver._id].sort().join("_");
            socket.emit("typing", { room, userId: currentUser._id });
          }}
          onBlur={() => {
            if (message.trim() === "") {
              // setIsTyping(false);
              const room = [currentUser._id, receiver._id].sort().join("_");
              socket.emit("stop_typing", { room, userId: currentUser._id });
            }
          }}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-purple-300"
        />
        <button
          onClick={sendMessage}
          className="bg-purple-500 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-600 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
