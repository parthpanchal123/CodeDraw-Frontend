import { useRef, useEffect, useContext, useState } from "react";
import { SocketContext } from "../context/socket";
import dotenv from "dotenv";
import { MdVideocam, MdVideocamOff, MdMic, MdMicOff } from "react-icons/md";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";

dotenv.config();

const peers = {};

const Video = ({ roomId, peer }) => {
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

              videoElem.addEventListener("ratechange", (event) => {
                console.log("The playback rate changed.");
                console.log(event);
              });

              videoElem.addEventListener("volumechange", (event) => {
                console.log("Volume change");
                console.log(event);
              });
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

    socket.on("audio-off", (userId) => {
      console.log("Disabling audio of", userId);
      const audioElementToDisable = document.getElementById(userId);
      if (!audioElementToDisable) return;

      audioElementToDisable.muted = true;
    });

    socket.on("audio-on", (userId) => {
      console.log("Enabling audio for", userId);
      const audioElementToEnable = document.getElementById(userId);
      if (!audioElementToEnable) return;
      audioElementToEnable.muted = false;
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
    if (!myStream) return;

    if (myMicOn) {
      myStream.getAudioTracks()[0].enabled = false;
      socket.emit("audio-off", peer.id);
      setMyMicOn((myMicOn) => !myMicOn);
    } else {
      myStream.getAudioTracks()[0].enabled = true;
      socket.emit("audio-on", peer.id);
      setMyMicOn((myMicOn) => !myMicOn);
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
      className="h-screen w-1/6 m-5 overflow-y-auto font-body"
      ref={videoGridRef}
    >
      <video
        ref={myVideoRef}
        id={peer.id}
        autoPlay={true}
        className="rounded-md"
        poster="https://i.imgur.com/bGOuVkD.png"
      />

      <div className="flex flex-row justify-center mt-1 rounded-lg shadow-2xl gap-x-4">
        {myCamOn === true ? (
          <MdVideocam size={26} color={"white"} onClick={() => playStop()} />
        ) : (
          <MdVideocamOff size={26} color={"white"} onClick={() => playStop()} />
        )}
        {myMicOn === true ? (
          <MdMic size={26} color={"white"} onClick={() => muteUnmute()} />
        ) : (
          <MdMicOff size={26} color={"white"} onClick={() => muteUnmute()} />
        )}
      </div>
      <ToastContainer autoClose={3000} position={"bottom-right"} />
    </div>
  );
};

export default Video;
