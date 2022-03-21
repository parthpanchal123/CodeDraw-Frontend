import FadeIn from "react-fade-in";
import CodeEditorWidget from "../components/codeEditorWidget";
const CodeEditor = ({ socket, setCode, code }) => {
  return (
    <FadeIn className="w-full">
      <div className="container h-screen">
        <CodeEditorWidget socket={socket} setCode={setCode} code={code} />
      </div>
    </FadeIn>
  );
};
export default CodeEditor;
