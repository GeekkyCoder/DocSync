import GroupEditor from "./GroupEditor";
import { Routes, Route, Navigate } from "react-router-dom";
import Appbar from "./components/AppBar";

const App = () => {
  return (
    <div>
      <Appbar />
      <Routes>
        <Route path="/" element={<Navigate to={`/group/${Date.now()}`} />} />
        <Route path="/group/:id" element={<GroupEditor />} />
      </Routes>
    </div>
  );
};

export default App;
