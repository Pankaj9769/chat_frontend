import { createContext, useEffect, useState } from "react";
export const Context = createContext(null);

export const ContextProvider = ({ children }) => {
  let [token, settoken] = useState(localStorage.getItem("token"));
  let [loggedIn, setLoggedIn] = useState(localStorage.getItem("loggedIn"));
  let [CurrentUser, setCurrentUser] = useState(
    localStorage.getItem("CurrentUser")
  );
  let [userList, setUserList] = useState(localStorage.getItem("userList"));

  useEffect(() => {
    if (token) {
      setLoggedIn(true);
      localStorage.setItem("loggedIn", true);
    }

    const checkUser = async () => {
      if (token) {
        const response = await fetch(
          "https://chatbackend-three.vercel.app/users",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("data->", data);
          setUserList(data.users);
          localStorage.setItem("userList", JSON.stringify(data.users));
        } else {
          logout();
          // localStorage.setItem("loggedIn", false);
        }
      }
    };
    checkUser();
  }, []);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      settoken(token);
      setLoggedIn(true);
      localStorage.setItem("loggedIn", true);
    }
  }, [token]);

  function logout() {
    settoken(null);
    localStorage.setItem("token", null);
    setLoggedIn(false);
    localStorage.setItem("loggedIn", false);
  }

  return (
    <Context.Provider
      value={{
        logout,
        CurrentUser,
        userList,
        setCurrentUser,
        loggedIn,
        setUserList,
        settoken,
      }}
    >
      {children}
    </Context.Provider>
  );
};
