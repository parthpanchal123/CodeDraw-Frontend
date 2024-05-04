import { useEffect, useState } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import { log } from "@craco/craco/lib/logger";

const ExcaliDrawWidget = ({ socket }) => {
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  const [localCanvasData, setLocalCanvasData] = useState(null);

  useEffect(() => {
    if (excalidrawAPI == null) return;
    console.log(excalidrawAPI.onChange);

    excalidrawAPI.onPointerUp(() => {
      console.log("Sending app data", excalidrawAPI?.getSceneElements());
      socket.emit("drawing-data", {
        elem: excalidrawAPI?.getSceneElements(),
        appState: excalidrawAPI?.getAppState(),
      });
    });

    // excalidrawAPI.onChange = (elements, appState, files) => {
    //   console.log(appState);
    // };
  }, [excalidrawAPI, socket]);

  useEffect(() => {
    socket.on("receive-drawing-data", ({ elem, appState }) => {
      console.log("Updated here", { elem, appState });
      excalidrawAPI?.updateScene({
        elements: elem,
        // appState: appState,
        collaborators: [],
      });
      // setLocalCanvasData(data);
    });
  }, [socket, excalidrawAPI]);

  return <Excalidraw excalidrawAPI={(api) => setExcalidrawAPI(api)} />;
};

export default ExcaliDrawWidget;
