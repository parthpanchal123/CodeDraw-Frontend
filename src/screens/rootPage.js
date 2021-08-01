import { useState, useRef } from "react";
import Together from "../images/together.png";
import axios from "axios";
import dotenv from "dotenv";
import FadeIn from "react-fade-in";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../App.css";
import { useHistory } from "react-router-dom";
import { ReactComponent as Logo } from "../images/logo.svg";
import { toast } from "react-toastify";
import { CgEnter } from "react-icons/cg";
import { BsPlusSquare } from "react-icons/bs";

dotenv.config();

const Rootpage = () => {
  const [loading, setLoading] = useState(false);
  const meetRef = useRef(null);
  const [newId, setId] = useState("");
  const history = useHistory();

  const joinMeet = () => {
    if (meetRef.current.value === "") {
      toast.error("Oopsie 🤔  ! Enter a valid meet id !", {
        style: {
          fontFamily: "Poppins",
        },
      });
      return;
    }

    try {
      history.push(`/${meetRef.current.value}`);
    } catch (error) {
      console.log(error);
    }
  };

  const creatNewMeet = async () => {
    setLoading(true);

    try {
      const meetingId = await axios.post(
        process.env.REACT_APP_SOCKET_SERVER_URL + "getId"
      );
      console.log(meetingId.data.id);
      setId(meetingId.data.id);
      toast(" 🚀 Copy and Send the meet id to your friends ", {
        style: {
          fontFamily: "Poppins",
          color: "black",
        },
      });
    } catch (error) {
      console.log(error);
      toast("Some error occured 😢 . Try checking your internet connection", {
        style: {
          fontFamily: "Poppins",
          color: "black",
        },
      });
    }
    setLoading(false);
  };
  return (
    <div className="leading-normal tracking-normal text-indigo-400 bg-bg bg-center sm:bg-left w-screen md:h-screen font-body">
      <div className="w-full container mx-auto p-5">
        <div className="w-full flex items-center justify-start">
          <Logo className="w-14 h-14 mr-2" />
          <a
            className="flex items-center text-indigo-400 no-underline hover:no-underline font-bold text-2xl lg:text-4xl"
            href="/"
          >
            Code
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-pink-500 to-purple-500">
              Draw
            </span>
          </a>
        </div>
      </div>

      <div className="container pt-20 md:pt-20 mx-auto flex flex-wrap flex-col md:flex-row items-center">
        <div className="flex flex-col w-full xl:w-2/5 justify-center lg:items-start overflow-hidden">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight text-center md:text-left">
            <span className="mr-2 bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-pink-500 to-purple-500">
              Interact . Scribble . Code
            </span>
            {/* with your friends . */}
            <p className="leading-normal text-base text-indigo-400 mt-2 md:text-2xl mb-1 text-center font-bold md:text-left">
              Communication & brainstorming made easier .
            </p>
          </h1>
          <p className="leading-normal text-base md:text-2xl font-bold mb-8 mt-10 text-center md:text-left">
            Doodle on whiteboard or code on editor while a audio/video call.
          </p>

          <form className="bg-gray-900 opacity-75 w-full shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
              <label className="block text-blue-300 py-2 font-bold mb-2">
                Join a meet
              </label>
              <input
                className="shadow appearance-none border rounded w-full p-3 text-gray-700 leading-tight focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
                id="meetId"
                type="text"
                ref={meetRef}
                placeholder="Meet-id ..."
              />
            </div>

            <div className="flex flex-row">
              <div className="flex items-center justify-between pt-4 mr-5">
                <button
                  className="bg-gradient-to-r from-purple-800 to-green-500 hover:from-pink-500 hover:to-green-500 text-white font-bold py-2 px-4 rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
                  type="button"
                  onClick={() => joinMeet()}
                >
                  <div className="flex flex-row justify-center items-center gap-x-2">
                    <CgEnter size={20} />
                    <span> Join meet</span>
                  </div>
                </button>
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  className="bg-gradient-to-r from-purple-800 to-green-500 hover:from-pink-500 hover:to-green-500 text-white font-bold py-2 px-4 rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
                  type="button"
                  onClick={() => creatNewMeet()}
                >
                  <div className="flex flex-row justify-center items-center gap-x-2">
                    {loading ? (
                      <div className="w-8 h-8 mx-3 border-4 border-blue-600 rounded-full loader" />
                    ) : (
                      <>
                        <BsPlusSquare size={18} />
                        <span> Create meet</span>
                      </>
                    )}
                  </div>

                  {/* New meet */}
                </button>
              </div>
            </div>
            {newId && (
              <FadeIn>
                <div className="flex flex-row text-md w-1/2 p-3 rounded-md shadow-inner my-6 bg-white">
                  {newId ?? ""}
                </div>
              </FadeIn>
            )}
          </form>
        </div>

        <div className="w-full xl:w-3/5 p-10 overflow-hidden ">
          <img
            className="mx-auto w-full md:w-3/5 transform -rotate-6 transition hover:scale-100 duration-700 ease-in-out hover:rotate-6 bg-together"
            alt="Together"
            src={Together}
          />
        </div>
      </div>
      <ToastContainer autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default Rootpage;
