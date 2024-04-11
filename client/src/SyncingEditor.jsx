import React, { useState, useRef, useEffect, useCallback } from "react";
import Card from "@mui/material/Card";
import { Editor } from "slate-react";
import { initialValue } from "./utils/slateInitialValue";
import { io } from "socket.io-client";
import { Value } from "slate";
import Box from "@mui/material/Box";
import EditorActionButton from "./components/EditorActionButton";
import { colors } from "@mui/material";

const socket = io("http://localhost:5173");

function SyncingEditor({ groupId }) {
  const [value, setValue] = useState(initialValue);

  const [formats, setFormats] = useState(() => []);
  const [mousePositions, setMousePositions] = useState({});

  const id = useRef(`${Date.now()}`);
  const remote = useRef(false);
  const editor = useRef(null);

  const handleFormat = (event, newFormats) => {
    newFormats.forEach((format) => {
      editor.current?.toggleMark(format);
    });
  };

  const renderMouseCursors = useCallback(() => {
    return Object.entries(mousePositions).map(([id, position]) => {
      return (
        <div
          style={{
            position: "absolute",
            left: position.x,
            top: position.y,
          }}
        >
          <div
            key={id}
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              cursor: "pointer",
              backgroundColor:
                id === socket.id ? colors["green"].A700 : colors["red"].A200,
            }}
          ></div>
          <div>{id === socket?.id ? "you" : "other guy"}</div>
        </div>
      );
    });
  }, [mousePositions]);

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

  useEffect(() => {
    const handleMouseMove = (e) => {
      const mousePosition = { x: e.clientX, y: e.clientY };
      socket.emit("mousemove", mousePosition);
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    socket.on("mousemove", (data) => {
      // Update the mouse positions state with the received data
      setMousePositions((prevMousePositions) => ({
        ...prevMousePositions,
        [data.id]: data.position,
      }));
    });

    return () => socket.off("mousemove");
  }, [groupId]);

  return (
    <>
      {renderMouseCursors()}
      <Card sx={{ m: "1em", p: "1em" }}>
        <EditorActionButton formats={formats} handleFormat={handleFormat} />

        <Box sx={{ my: "1em" }}>
          <Editor
            ref={editor}
            value={value}
            renderMark={(props, _editor, next) => {
              if (props.mark.type === "bold") {
                return <strong>{props.children}</strong>;
              } else if (props.mark.type === "italic") {
                return <em>{props.children}</em>;
              } else if (props.mark.type === "code") {
                return <code>{props.children}</code>;
              } else if (props.mark.type === "underlined") {
                return <u>{props.children}</u>;
              } else if (props.mark.type === "highlight") {
                return (
                  <span style={{ backgroundColor: "yellow" }}>
                    {props.children}
                  </span>
                );
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
              minHeight: 250,
              maxWidth: 800,
            }}
          />
        </Box>
      </Card>
    </>
  );
}

export default SyncingEditor;
