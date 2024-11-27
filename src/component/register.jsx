import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();

  const registerUser = async (event) => {
    event.preventDefault();

    const user = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      const response = await fetch(
        "https://chatbackend-three.vercel.app/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Registered Successfully");
        navigate("/login");
        nameRef.current.value = "";
        emailRef.current.value = "";
        passwordRef.current.value = "";
      } else {
        toast.error(`${data.response}`);
      }
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-3 bg-red-50 h-max subpixel-antialiased">
      <div className="w-[80%] md:w-[28%] flex flex-col items-center bg-white border-[1px] border-gray-200 rounded-lg">
        <img src="images/myntra-offer-2.png" alt="Myntra Offer" />
        <span className="text-lg font-semibold text-gray-700 mt-2">Signup</span>
        <form
          onSubmit={registerUser}
          className="flex flex-col items-center w-full p-1"
        >
          <input
            type="text"
            id="name"
            placeholder="Name"
            className="inline h-10 w-[90%] border-[1px] mt-1 mb-2 border-gray-200 outline-none focus:border-black p-2 rounded-md"
            ref={nameRef}
          />

          <input
            type="text"
            id="email"
            placeholder="Email"
            className="inline h-10 w-[90%] border-[1px] mt-2 mb-2 border-gray-200 outline-none focus:border-black p-2 rounded-md"
            ref={emailRef}
          />

          <input
            type="password"
            placeholder="Password"
            className="inline h-10 w-[90%] border-[1px] mt-2 mb-2 border-gray-200 outline-none focus:border-black p-2 rounded-md"
            ref={passwordRef}
          />
          <button
            type="submit"
            className="bg-red-500 w-[50%] py-2 rounded-sm my-2 text-white font-semibold hover:bg-red-600"
          >
            Register
          </button>
          <span className="text-xs text-gray-500 my-1">
            Already a customer?
            <Link to="/login" className="text-red-500 font-semibold">
              {" "}
              Login
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Register;
