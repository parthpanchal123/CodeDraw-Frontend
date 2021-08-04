import { GrUndo, GrBrush, GrPowerReset } from "react-icons/gr";
import { AiOutlineClear } from "react-icons/ai";
import { TiBrush } from "react-icons/ti";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const Toolbar = ({ setColor, undo, clearDrawing, setBrushRadius }) => {
  return (
    <div className=" flex flex-row justify-center items-center rounded-full w-2/5 bg-gray-900 shadow-2xl p-4 mb-3  ">
      <span
        className="rounded-full mx-1 h-8 w-8 flex items-center justify-center bg-black border-2 border-white transform hover:scale-110 motion-reduce:transform-none "
        onClick={(e) => setColor("black")}
      ></span>
      <span
        className="rounded-full mx-1 h-8 w-8 flex items-center justify-center bg-red-500 border-2 border-white transform hover:scale-110 motion-reduce:transform-none "
        onClick={(e) => setColor("red")}
      ></span>
      <span
        className="rounded-full mx-1 h-8 w-8 flex items-center justify-center bg-blue-500 border-2 border-white transform hover:scale-110 motion-reduce:transform-none "
        onClick={(e) => setColor("blue")}
      ></span>
      <span
        className="rounded-full mx-1 h-8 w-8 flex items-center justify-center bg-green-500 border-2 border-white transform hover:scale-110 motion-reduce:transform-none "
        onClick={(e) => setColor("green")}
      ></span>
      <span
        className="rounded-full mx-1 h-8 w-8 flex items-center justify-center transform hover:scale-110 motion-reduce:transform-none "
        onClick={(e) => setColor("green")}
      >
        <GrUndo color={"white"} size={22} onClick={(e) => undo()} />
      </span>

      <span
        className="rounded-full mx-1 h-8 w-8 flex items-center justify-center transform hover:scale-110 motion-reduce:transform-none "
        onClick={(e) => setColor("green")}
      >
        <AiOutlineClear
          size={20}
          color={"white"}
          // style={{ fontSize: "28px", color: "black" }}
          onClick={(e) => clearDrawing()}
        />
      </span>

      <span className=" flex flex-row ml-8 w-28">
        <TiBrush color={"white"} size={26} className="mr-3" />
        <Slider
          min={1}
          onChange={(num) => setBrushRadius(num)}
          dotStyle={{
            borderColor: "grey",
          }}
          handleStyle={{
            borderColor: "blue",
            borderWidth: "8px",
          }}
          max={6}
          included={false}
          defaultValue={20}
          marks={{ 1: 1, 2: 2, 3: 4, 4: 6, 5: 10, 6: 12 }}
          step={1}
        />
      </span>
    </div>
  );
};

export default Toolbar;
