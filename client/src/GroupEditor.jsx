import React, { useState } from "react";
import SyncingEditor from "./SyncingEditor";
import { useParams } from "react-router-dom";

function GroupEditor({ socket, formData, setFormData }) {
  const { id } = useParams();

  return (
    <div>
      <SyncingEditor
        groupId={id}
        roomId={formData.roomId}
        socket={socket}
        userName={formData.username}
        setFormData={setFormData}
        formData={formData}
      />
    </div>
  );
}

export default GroupEditor;
