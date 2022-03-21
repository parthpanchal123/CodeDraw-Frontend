import "./App.css";
import { useState } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import RoomPage from "./screens/roomPage";
import { SocketContext, socket } from "./context/socket";
import Rootpage from "./screens/rootPage";
import Navbar from "./components/nav";

function App() {
  const [isBoardActive, setBoardActive] = useState(true);
  return (
    <SocketContext.Provider value={socket}>
      <Router>
        {/* <Switch> */}
        <Route path="/" exact>
          <div>
            <Rootpage />
          </div>
        </Route>
        <Route path="/:roomId" exact>
          <Navbar
            isBoardActive={isBoardActive}
            setBoardActive={setBoardActive}
          />
          <RoomPage
            isBoardActive={isBoardActive}
            setBoardActive={setBoardActive}
          />
        </Route>
      </Router>
    </SocketContext.Provider>
  );
}

export default App;
