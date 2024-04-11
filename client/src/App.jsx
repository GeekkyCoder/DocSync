import GroupEditor from "./GroupEditor";
import { Routes, Route, Navigate } from "react-router-dom";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigate to={`/group/${Date.now()}`} />} />
        <Route path="/group/:id" element={<GroupEditor />} />
      </Routes>
    </div>
  );
};

export default App;
