import React from "react";
import { useParams } from "react-router-dom";

import Video from "../components/video";
import SharedContent from "../components/shared";
import "react-toastify/dist/ReactToastify.css";

const RoomPage = ({ isBoardActive, setBoardActive }) => {
  const { roomId } = useParams();

  console.log(roomId);

  return (
    <>
      <div className="flex flex-col md:flex-row  xs:flex-col w-full justify-start gap-x-4 ">
        <SharedContent
          isBoardActive={isBoardActive}
          setBoardActive={setBoardActive}
        />
        <Video roomId={roomId} />
      </div>
    </>
  );
};

export default RoomPage;
