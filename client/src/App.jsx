import GroupEditor from "./GroupEditor";
import { Routes, Route, Navigate } from "react-router-dom";
import Appbar from "./components/AppBar";

import { v4 as uuidv4 } from "uuid";

const groupId = uuidv4();

const App = () => {
  return (
    <div>
      <Appbar />
      <Routes>
        <Route path="/" element={<Navigate to={`/group/${groupId}`} />} />
        <Route path="/group/:id" element={<GroupEditor />} />
      </Routes>
    </div>
  );
};

export default App;
