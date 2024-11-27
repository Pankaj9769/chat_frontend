import { useState } from "react";
import UserList from "./component/userList";
import ChatRoom from "./component/ChatRoom";
import io from "socket.io-client";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";

const socket = io("https://chatbackend-three.vercel.app/", {
  auth: {
    token: localStorage.getItem("token"),
  },
});

function App() {
  const loggedIn = localStorage.getItem("loggedIn");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  // if (!loggedIn) {
  //   navigate("/login");
  // }

  const [selectedUser, setSelectedUser] = useState(null);
  // const

  return (
    <>
      <div className="bg-yellow-300 h-full">
        <div className="flex flex-row justify-center items-start h-max bg-red-200">
          <UserList
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
          />
          <ChatRoom selectedUser={selectedUser} socket={socket} />
        </div>
      </div>
    </>
  );
}

export default App;
