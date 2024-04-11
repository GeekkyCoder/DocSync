import * as React from "react";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import CodeIcon from "@mui/icons-material/Code";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import HighlightIcon from '@mui/icons-material/Highlight';

function EditorActionButton({ formats, handleFormat }) {
  return (
    <ToggleButtonGroup
      value={formats}
      onChange={handleFormat}
      aria-label="text formatting"
    >
      <ToggleButton value="bold" aria-label="bold">
        <FormatBoldIcon />
      </ToggleButton>
      <ToggleButton value="italic" aria-label="italic">
        <FormatItalicIcon />
      </ToggleButton>
      <ToggleButton value="underlined" aria-label="underlined">
        <FormatUnderlinedIcon />
      </ToggleButton>
      <ToggleButton value="code" aria-label="code">
        <CodeIcon />
      </ToggleButton>
      <ToggleButton value="highlight" aria-label="highlight">
        <HighlightIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}

export default EditorActionButton;
