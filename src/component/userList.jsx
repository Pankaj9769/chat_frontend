import { useContext } from "react";
import { Context } from "../../Context";
import { CgProfile } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
const UserList = ({ selectedUser, setSelectedUser }) => {
  const CurrentUser = JSON.parse(localStorage.getItem("CurrentUser"));
  const userList = JSON.parse(localStorage.getItem("userList"));
  const navigate = useNavigate();
  const logout = () => {
    localStorage.setItem("token", null);
    localStorage.setItem("loggedIn", false);
    navigate("/login");
  };

  return (
    <>
      <div className="p-5 w-max antialiased ring-gray-400 font-mono rounded-md ring-[1px] bg-purple-50">
        <a
          className="uppercase hover:underline tracking-widest hover:text-purple-500"
          onClick={logout}
        >
          Logout
        </a>
        <div className="font-bold text-2xl text-gray-800 font-mono border-b-[1px] border-gray-400 p-1">
          <span className="text-xl text-gray-600">Welcome,</span>
          <span className="text-purple-700"> {CurrentUser.name}</span>
        </div>
        <span className="font-semibold font-mono mt-3">Friends</span>
        <ul>
          {userList &&
            userList
              .filter((user) => user._id !== CurrentUser._id)
              .map((user) => (
                <li
                  className="flex flex-row"
                  key={user._id}
                  onClick={() => setSelectedUser(user._id)}
                >
                  <a
                    href="#"
                    className=" hover:text-purple-700  py-3 w-full border-b-[1px] border-purple-400 text-center flex flex-row justify-between items-center "
                  >
                    <CgProfile size={22} />
                    {user.name}
                  </a>
                </li>
              ))}
        </ul>
      </div>
    </>
  );
};

export default UserList;
