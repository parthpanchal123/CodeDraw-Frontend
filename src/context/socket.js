import socketio from "socket.io-client";
import dotenv from "dotenv";
import { createContext } from "react";

dotenv.config();

const socket = socketio.connect(process.env.REACT_APP_SOCKET_SERVER_URL);
const SocketContext = createContext();

export { socket, SocketContext };
