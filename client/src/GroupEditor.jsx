import React from "react";
import SyncingEditor from "./SyncingEditor";
import { useParams } from "react-router-dom";

function GroupEditor() {
  const { id } = useParams();

  return (
    <div>
      <SyncingEditor groupId={id} />
    </div>
  );
}

export default GroupEditor;
