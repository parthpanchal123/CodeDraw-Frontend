import { useRef, useEffect, useContext, useState } from "react";
import { SocketContext } from "../context/socket";
import Peer from "peerjs";
import dotenv from "dotenv";
import { MdVideocam, MdVideocamOff, MdMic, MdMicOff } from "react-icons/md";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";

dotenv.config();

const peers = {};

const peer = new Peer(undefined, {
  path: "/peerJs",
  host: "/",
  port: parseInt(process.env.PORT) || 5000,
});
const Video = ({ roomId }) => {
  const myVideoRef = useRef(null);
  const videoGridRef = useRef(null);
  const [myCamOn, setMyCamOn] = useState(false);
  const [myMicOn, setMyMicOn] = useState(false);
  const [myStream, setMyStream] = useState(null);
  const socket = useContext(SocketContext);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        myVideoRef.current.srcObject = stream;
        myVideoRef.current.muted = true;
        setMyStream(stream);
        setMyCamOn(true);
        setMyMicOn(true);
      })
      .catch((err) => {
        switch (err.message) {
          case "Permission denied":
            toast.error(
              "Camera Permission denied . Try giving permission and refresh the page \n ",
              {
                style: {
                  fontFamily: "Poppins",
                },
              }
            );
            break;
          case "Requested device not found":
            toast.error(
              "We couldn't reach your video/audio devices.Try reconnecting them back !",
              {
                style: {
                  fontFamily: "Poppins",
                },
              }
            );
            break;

          default:
            break;
          // toast.error(err.message);
        }

        setMyCamOn(false);
        setMyMicOn(false);

        console.log(err);
      });

    socket.on("user-connected", (userId) => {
      console.log(`New user connected ${userId}`);

      try {
        const videoElem = document.createElement("video", {
          autoPlay: true,
        });
        navigator.mediaDevices
          .getUserMedia({ audio: true, video: true })
          .then((stream) => {
            const call = peer.call(userId, stream, { metadata: peer.id });

            console.log(`Call is ${call}`);

            call.on("stream", (userVideoStream) => {
              console.log("getting remote stream");
              console.log(userVideoStream);
              videoElem.srcObject = userVideoStream;
              videoElem.id = userId;
              videoElem.classList.add("rounded-md", "my-3");

              videoElem.addEventListener("loadedmetadata", () => {
                videoElem.play();
              });

              videoElem.addEventListener("volumechange", () => {
                console.log("Volume change");
              });

              // videoGridRef.current.appendChild(videoElem);
            });

            call.on("closeVideo", () => {
              console.log("video closing");
            });

            call.on("close", () => {
              console.log("Removing Video 118");
              videoElem.remove();
            });
            console.log("Added child 1");
            videoGridRef.current?.appendChild(videoElem);
            peers[userId] = call;
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (error) {
        console.log(error);
        throw error;
      }
      toast.dark("Someone just joined");
    });

    socket.on("user-disconnected", (userId) => {
      if (peers[userId]) peers[userId].close();
      toast.info("Someone just disconnected", {
        style: {
          fontFamily: "Poppins",
        },
      });
    });

    socket.on("video-off", (userId) => {
      console.log("Disable video for", userId);
      const videoElementToDisable = document.getElementById(userId);

      if (!videoElementToDisable) return;
      videoElementToDisable.style.display = "none";
    });

    socket.on("video-on", (userId) => {
      console.log("Enabling video for", userId);
      const videoElementToEnable = document.getElementById(userId);
      if (!videoElementToEnable) return;
      videoElementToEnable.style.display = "block";
    });

    peer.on("open", (id) => {
      console.log(id);
      socket.emit("join-room", roomId, id);
    });

    peer.on("close", () => {
      console.log("Closed 146");
      console.log("Connection closed");
    });

    peer.on("call", (call) => {
      const callersId = call.metadata;

      const videoElem = document.createElement("video", {
        autoPlay: true,
      });

      navigator.mediaDevices
        .getUserMedia({ audio: true, video: true })
        .then((stream) => {
          call.answer(stream);

          call.on("stream", (userVideoStream) => {
            videoElem.srcObject = userVideoStream;
            videoElem.id = callersId;
            console.log(userVideoStream);

            videoElem.classList.add("rounded-md", "my-3");

            videoElem.addEventListener("loadedmetadata", () => {
              videoElem.play();
            });
          });

          call.on("close", () => {
            console.log("Call closed 173");
            videoElem.remove();
          });
        })
        .catch((err) => {
          console.log(err);
        });
      console.log("Added child 2");
      videoGridRef.current?.appendChild(videoElem);
    });
  }, [roomId, socket]);

  const muteUnmute = () => {
    console.log("Status is " + myMicOn.toString());

    if (myMicOn) {
      myStream.getAudioTracks()[0].enabled = false;
      setMyMicOn((myMicOn) => !myMicOn);
    } else {
      setMyMicOn((myMicOn) => !myMicOn);
      myStream.getAudioTracks()[0].enabled = true;
    }
  };

  const playStop = () => {
    if (!myStream) {
      toast.error("Camera permission is denied.", {
        style: {
          fontFamily: "Poppins",
        },
      });
      return;
    }

    console.log(myCamOn);

    if (myCamOn) {
      myStream.getVideoTracks()[0].enabled = false;
      socket.emit("video-off", peer.id);
      setMyCamOn((myCamOn) => !myCamOn);
    } else {
      myStream.getVideoTracks()[0].enabled = true;
      socket.emit("video-on", peer.id);
      setMyCamOn((myCamOn) => !myCamOn);
    }
  };

  return (
    <div
      className="h-screen w-1/6 m-5 overflow-y-scroll font-body"
      ref={videoGridRef}
    >
      <video
        ref={myVideoRef}
        id={peer.id}
        autoPlay={true}
        className="rounded-md"
        poster="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn0.iconfinder.com%2Fdata%2Ficons%2Fphotography-solid-4%2F32%2FPhotography_camera_no_off_forbidden_photo_video-512.png&f=1&nofb=1"
      />

      <div className="flex flex-row justify-center mt-1 rounded-lg shadow-2xl gap-x-4">
        {myCamOn === true ? (
          <MdVideocam size={26} onClick={() => playStop()} />
        ) : (
          <MdVideocamOff size={26} onClick={() => playStop()} />
        )}
        {myMicOn === true ? (
          <MdMic size={26} onClick={() => muteUnmute()} />
        ) : (
          <MdMicOff size={26} onClick={() => muteUnmute()} />
        )}
      </div>
      <ToastContainer autoClose={3000} position={"bottom-right"} />
    </div>
  );
};

export default Video;
