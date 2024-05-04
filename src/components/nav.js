import { ReactComponent as Logo } from "../images/logo.svg";
import { useContext } from "react";
import { SocketContext } from "../context/socket";
import { useHistory } from "react-router-dom";
import { MdExitToApp } from "react-icons/md";

const Navbar = ({ isBoardActive, setBoardActive }) => {
  const n = "</Code>";
  const socket = useContext(SocketContext);
  const nav = useHistory();
  return (
    <div>
      <div className=" flex flex-row items-center justify-between	bg-transperant bg-opacity-100 px-12 py-4 w-full font-body">
        <div className="flex flex-row">
          <div className="text-2xl text-white font-semibold inline-flex items-center ">
            <Logo className="w-12 h-12" />
            <a className="flex items-center text-indigo-400 no-underline hover:no-underline font-bold text-2xl">
              Code
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-pink-500 to-purple-500">
                Draw
              </span>
            </a>
          </div>

          <div className="mx-10 text-white">
            <button
              className={`w-24 mr-3 px-2 py-2 bg-gradient-to-tr from-blue-900 via-purple-900 to-indigo-600  rounded-lg transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-100 ${
                isBoardActive && "ring-2 ring-white"
              }`}
              onClick={() => {
                if (isBoardActive) return;
                setBoardActive((board) => !board);
              }}
            >
              🖌️ Draw
            </button>
            <button
              className={`w-26 px-2 py-2 bg-gradient-to-tr from-indigo-600 via-purple-900 to-blue-900 rounded-lg transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-100  ${
                !isBoardActive && "ring-2 ring-white"
              }`}
              onClick={() => {
                if (!isBoardActive) return;
                setBoardActive((board) => !board);
              }}
            >
              💻 {n}
            </button>
          </div>
        </div>
        <div className="flex flex-row">
          <button
            className={`text-white w-26 px-2 py-2 bg-red-500	rounded-lg transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-100  `}
            onClick={() => {
              console.log("Leaving the room");
              socket.disconnect();
              nav.replace("/");
            }}
          >
            <span className="flex flex-row items-center justify-center gap-x-2">
              <MdExitToApp size={20} />
              Leave
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
