import React, { useState, useRef, useEffect } from "react";
import { Editor } from "slate-react";
import { initialValue } from "./utils/slateInitialValue";
import { io } from "socket.io-client";
import { Value } from "slate";
import "./sync-editor.css";

const socket = io("http://localhost:5173");

function SyncingEditor({ groupId }) {
  const [value, setValue] = useState(initialValue);

  const id = useRef(`${Date.now()}`);
  const remote = useRef(false);
  const editor = useRef(null);

  const hanldleTextBold = (e) => {
    e.preventDefault();

    editor.current?.toggleMark("bold");
  };

  const hanldleTextItalic = (e) => {
    e.preventDefault();

    editor.current?.toggleMark("italic");
  };

  useEffect(() => {
    //getting initial value for editor by get request
    fetch(`http://localhost:5173/groups/${groupId}`)
      .then((x) => x.json())
      .then((data) => {
        console.log(data);
        setValue(Value.fromJSON(data));
      });

    const eventName = `new-remote-operations-${groupId}`;

    socket.on(eventName, ({ editorId, ops }) => {
      if (id.current !== editorId) {
        remote.current = true;
        ops.forEach((op) => editor.current?.applyOperation(op));
        remote.current = false;
      }
    });

    return () => socket.off(eventName);
  }, [groupId]);

  return (
    <>
      <div className="sync-editor-actions-container">
        <button onClick={hanldleTextBold}>Bold</button>
        <button onClick={hanldleTextItalic}>Italic</button>
      </div>

      <Editor
        ref={editor}
        value={value}
        onKeyDown={(event) => {
          if (event.key === "&") {
            event.preventDefault();
            editor.current.insertText("and");
          }
        }}
        renderMark={(props, _editor, next) => {
          if (props.mark.type === "bold") {
            return <strong>{props.children}</strong>;
          } else if (props.mark.type === "italic") {
            return <em>{props.children}</em>;
          }

          next();
        }}
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
            socket.emit("new_operation", {
              editorId: id.current,
              ops,
              value: value.toJSON(),
              groupId,
            });
          }
        }}
        style={{
          minHeight: 150,
          maxWidth: 800,
        }}
      />
    </>
  );
}

export default SyncingEditor;
