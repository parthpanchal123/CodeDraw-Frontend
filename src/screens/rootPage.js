import { useState, useRef } from "react";
import Together from "../images/together.png";
import axios from "axios";
import dotenv from "dotenv";
import FadeIn from "react-fade-in";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../App.css";
import "../index.css";
import { useHistory } from "react-router-dom";
import { ReactComponent as Logo } from "../images/logo.svg";
import { toast } from "react-toastify";
import { CgEnter } from "react-icons/cg";
import { BsPlusSquare } from "react-icons/bs";
import { AiFillInfoCircle } from "react-icons/ai";
import { HiClipboardCopy } from "react-icons/hi";

dotenv.config();

const Rootpage = () => {
  const [loading, setLoading] = useState(false);
  const [newMeetLoading, setNewMeetLoading] = useState(false);
  const meetRef = useRef(null);
  const [newId, setId] = useState("");
  const history = useHistory();

  const validateMeet = async (meetId) => {
    try {
      const meetData = await axios.post(
        process.env.REACT_APP_BACKEND_SERVER_URL + "/id/isValid",
        { meetId }
      );
      const { status } = meetData.data;
      return status;
    } catch (error) {
      toast.error(
        "Oopsie 🤔 , There was an error generating a meet id . Try checking your internet",
        {
          style: {
            fontFamily: "Poppins",
          },
        }
      );

      return false;
    }
  };

  const joinMeet = async () => {
    setNewMeetLoading(true);
    if (meetRef.current.value === "") {
      toast.error("Oopsie 🤔 , Meet id can't be empty!", {
        style: {
          fontFamily: "Poppins",
        },
      });
      setNewMeetLoading(false);
      return;
    }

    const isValidMeet = await validateMeet(meetRef.current.value);

    if (isValidMeet) {
      history.push(`/${meetRef.current.value}`);
    } else {
      toast.error("Oopsie 🤔 , Enter a valid meet id !", {
        style: {
          fontFamily: "Poppins",
        },
      });
    }
    setNewMeetLoading(false);
  };

  const creatNewMeet = async () => {
    if (newId !== "") {
      toast.info("Psst 🤔 , You already generated a new id !", {
        style: {
          fontFamily: "Poppins",
        },
      });
      return;
    }
    setLoading(true);

    try {
      const meetingId = await axios.post(
        process.env.REACT_APP_BACKEND_SERVER_URL + "/id"
      );
      // console.log(meetingId.data.id);
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
    <div className="w-screen overflow-auto" id="main-container">
      <div className="leading-normal tracking-normal text-indigo-400 bg-bg bg-center w-full h-full font-body ">
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

        <div className="container p-8 mx-auto flex flex-wrap flex-col md:flex-row items-center">
          <div className="flex flex-col w-full xl:w-2/5 justify-center lg:items-start overflow-hidden">
            <h1 className="text-2xl md:text-4xl font-bold leading-tight text-center md:text-left">
              <span className="mr-2 bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-pink-500 to-purple-500">
                Interact . Scribble . Code
              </span>
              {/* with your friends . */}
              <p className="leading-normal text-base text-indigo-400 mt-2 md:text-2xl mb-1 text-center font-bold md:text-left">
                Communication & brainstorming made easier .
              </p>
            </h1>
            <p className="leading-normal text-base md:text-2xl font-bold mb-8 mt-5 text-center md:text-left">
              Doodle on whiteboard or code on editor while a audio/video call.
            </p>
            <div className="md:w-full">
              <form className="opacity-80 bg-opacity-75 bg-gray-900 rounded-lg shadow-inner md:w-full px-5 pt-6 pb-8 mb-4">
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

                <div className="flex flex-row pt-2">
                  <div className="flex items-center justify-between mr-5">
                    <button
                      className="bg-gradient-to-r from-purple-800 to-green-500 hover:from-pink-500 hover:to-green-500 text-white font-bold py-2 px-4 rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
                      type="button"
                      onClick={() => joinMeet()}
                    >
                      <div className="flex flex-row justify-center items-center gap-x-2 sm:gap-x-1">
                        {newMeetLoading ? (
                          <div className="w-8 h-8 mx-3 border-4 border-white rounded-full loader" />
                        ) : (
                          <>
                            <CgEnter size={20} />
                            <span>Join meet</span>
                          </>
                        )}
                      </div>
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      className="bg-gradient-to-r from-purple-800 to-green-500 hover:from-pink-500 hover:to-green-500 text-white font-bold py-2 px-4 rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
                      type="button"
                      onClick={() => creatNewMeet()}
                    >
                      <div className="flex flex-row justify-center items-center gap-x-2 sm:gap-x-1">
                        {loading ? (
                          <div className="w-8 h-8 mx-3 border-4 border-white rounded-full loader" />
                        ) : (
                          <>
                            <BsPlusSquare size={18} />
                            <span>Create meet</span>
                          </>
                        )}
                      </div>
                    </button>
                  </div>
                </div>
                {newId && (
                  <FadeIn>
                    <div className="flex flex-row justify-between text-md p-3 rounded-md shadow-inner my-6 bg-white">
                      <span>{newId ?? ""}</span>
                      <HiClipboardCopy
                        size={20}
                        className="cursor-pointer hover:text-blue-500"
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText("34435453");
                            toast(" 🚀 Meeting id copied to clipboard ", {
                              style: {
                                fontFamily: "Poppins",
                                color: "black",
                              },
                            });
                          } catch (error) {
                            console.log(error);
                          }
                        }}
                      />
                    </div>
                    <span className="text-sm italic flex flex-row gap-x-1">
                      <AiFillInfoCircle size={18} />
                      Your friends join in with this id.
                    </span>
                  </FadeIn>
                )}
              </form>
            </div>
          </div>

          <div className="w-full xl:w-3/5 p-10 overflow-hidden " id="graphic">
            <img
              className="mx-auto w-full md:w-3/5 transform -rotate-6 transition hover:scale-100 duration-700 ease-in-out hover:rotate-6 bg-together"
              alt="Together"
              src={Together}
            />
          </div>
        </div>
        <ToastContainer autoClose={3000} hideProgressBar={false} />
      </div>
    </div>
  );
};

export default Rootpage;
