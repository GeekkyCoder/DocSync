import React, { useState, useRef, useEffect } from "react";
import { Editor } from "slate-react";
import Mitt from "mitt";
import { initialValue } from "./utils/slateInitialValue";

const emitter = new Mitt();

function SyncingEditor() {
  const [value, setValue] = useState(initialValue);

  const id = useRef(`${Date.now()}`);
  const remote = useRef(false);
  const editor = useRef(null);

  useEffect(() => {
    //listening on evert change
    emitter.on("*", (type, ops) => {
      if (id.current !== type) {
        remote.current = true;
        ops.forEach((op) => editor.current?.applyOperation(op));
        remote.current = false;
      }
    });
  }, []);

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
          emitter.emit(id.current, ops);
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
