import React, { useState, useRef, useEffect } from "react";
import { Editor } from "slate-react";
import { initialValue } from "./utils/slateInitialValue";
import { io } from "socket.io-client";

const socket = io("http://localhost:5173");

function SyncingEditor() {
  const [value, setValue] = useState(initialValue);

  const id = useRef(`${Date.now()}`);
  const remote = useRef(false);
  const editor = useRef(null);

  useEffect(() => {
    //listening on event change
    socket.on("new-remote-operations", ({editorId, ops}) => {
      if (id.current !== editorId) {
        remote.current = true;
        JSON.parse(ops).forEach((op) => editor.current?.applyOperation(op));
        remote.current = false;
      }
    });
  }, [socket]);

  return (
    <Editor
      ref={editor}
      value={value}
      onChange={(opts) => {
        setValue(opts.value);

        const ops = opts.operations
          .filter((o) => {
            if (o) {
              return (
                o.type !== "set_selection" &&
                o.type !== "set_value" &&
                (!o.data || !o.data.has("source"))
              );
            }

            return false;
          })
          .toJS()
          .map((o) => ({ ...o, data: { source: "one" } }));

        if (ops.length && !remote.current) {
          socket.emit("new_operation",{editorId:id.current, ops:JSON.stringify(ops)});
        }
      }}
      style={{
        minHeight: 150,
        maxWidth: 500,
      }}
    />
  );
}

export default SyncingEditor;
