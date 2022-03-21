import { useState, useRef } from "react";
import CodeMirror from "@uiw/react-codemirror";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import { FaPlayCircle } from "react-icons/fa";
import "codemirror/addon/display/autorefresh";
import "codemirror/addon/comment/comment";
import "codemirror/addon/edit/matchbrackets";
import "codemirror/theme/dracula.css";
import "codemirror/theme/monokai.css";
import "codemirror/theme/seti.css";
import "codemirror/theme/oceanic-next.css";
import "codemirror/theme/xq-light.css";
import "codemirror/theme/material.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/python/python";
import "codemirror/mode/clike/clike";

require("codemirror/lib/codemirror.css");

const langOptions = [
  { value: "javascript", label: "Javascript", extension: "js" },
  { value: "c++", label: "C++", extension: "cpp" },
  { value: "c", label: "C", extension: "c" },
  { value: "python", label: "Python", extension: "py" },
  { value: "java", label: "Java", extension: "java" },
];

const themeOptions = [
  { value: "dracula", label: "Dracula" },
  { value: "monokai", label: "Monokai" },
  { value: "oceanic-next", label: "Oceanic Next" },
  { value: "seti", label: "Seti" },
  { value: "xq-light", label: "Light" },
];

const CodeEditorWidget = ({ socket, code, setCode }) => {
  const [theme, setTheme] = useState({ value: "dracula", label: "Dracula" });
  const [lang, setLang] = useState({
    value: "javascript",
    label: "Javascript",
  });
  const editorRef = useRef(null);
  const outputRef = useRef(null);
  const inputRef = useRef(null);
  const [output, setOutput] = useState("");
  const [inputArg, setInputArgs] = useState("");
  const [myCode, setMyCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const throttle = (callback, delay) => {
    let previousCall = new Date().getTime();
    return function () {
      const time = new Date().getTime();

      if (time - previousCall >= delay) {
        previousCall = time;
        callback.apply(null, arguments);
      }
    };
  };

  const executeCode = async () => {
    outputRef.current.value = "";
    setLoading(true);

    if (myCode === "" && code === "") {
      toast.dark("No code to compile !", {
        style: {
          fontFamily: "Poppins",
        },
      });
      setLoading(false);
      return;
    }

    console.log(inputArg);
    const curr = {
      mode: lang.value,
      properties: {
        // language: lang.value === "clike" ? "cpp" : lang.value,
        language:
          lang.label === "C" ? "c" : lang.label === "C++" ? "cpp" : lang.value,
        files: [
          {
            name: "program." + lang.extension,
            content: code ?? myCode,
          },
        ],
        stdin: inputArg,
      },
    };

    try {
      const d = await axios.post(
        process.env.REACT_APP_BACKEND_SERVER_URL + "/exec",
        curr,
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
      console.log(d.data);

      if (d.data.stderr != null) {
        setOutput(d.data.stderr);
        setError(true);
        toast.error(" 😢 Error occured . Try fixing your code !", {
          style: {
            fontFamily: "Poppins",
          },
        });
      } else if (d.data.exception != null) {
        setOutput(d.data.exception);
        toast.error("Did you miss giving arguements ?", {
          style: {
            fontFamily: "Poppins",
          },
        });
        setError(true);
      } else {
        setOutput(d.data.stdout);
        toast.success(" 🎉 Successfully executed ", {
          style: {
            fontFamily: "Poppins",
          },
        });
        setError(false);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
    outputRef.current.focus();
    outputRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const sendChanges = (inst) => {
    console.log("Sending changes" + inst.getValue());
    socket.emit("editor-changes", inst.getValue());
  };

  return (
    <>
      <div className="h-full">
        <div className="flex flex-row h-4/6 m-5 gap-x-2 ">
          <div className="w-3/4 rounded-md shadow-2xl">
            <CodeMirror
              value={code}
              className="h-full"
              options={{
                theme: theme.value,
                matchBrackets: true,
                lineNumbers: true,
                autoRefresh: true,
                mode:
                  lang.label === "C" || lang.label === "C++"
                    ? "clike"
                    : lang.value,
              }}
              ref={editorRef}
              onChange={(inst) => {
                setCode(inst.getValue());
                throttle(sendChanges(inst), 1000);
              }}
            />
          </div>
          <div className="flex flex-row gap-x-3 h-12 items-center">
            <Select
              value={lang}
              defaultInputValue={langOptions[0].value}
              className="w-32"
              closeMenuOnSelect={true}
              onChange={(language) => setLang(language)}
              options={langOptions}
            />
            <Select
              value={theme}
              className="w-32"
              defaultInputValue={themeOptions[0].value}
              onChange={(theme_sel) => setTheme(theme_sel)}
              options={themeOptions}
            />

            {loading ? (
              <div className="w-8 h-8 border-4 border-blue-600 rounded-full loader"></div>
            ) : (
              <FaPlayCircle
                className=""
                size={26}
                color="green"
                onClick={() => executeCode()}
              />
            )}
          </div>
        </div>
        <div className="flex flex-col mx-5">
          <div className="my-3">
            <textarea
              rows={4}
              cols={80}
              className="shadow-2xl"
              placeholder="Input"
              ref={inputRef}
              onChange={(text) => setInputArgs(text.target.value)}
            />
          </div>
          <div>
            <textarea
              rows={6}
              cols={80}
              value={output ?? " "}
              className="shadow-2xl"
              readOnly={true}
              ref={outputRef}
              placeholder={"Output"}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CodeEditorWidget;
