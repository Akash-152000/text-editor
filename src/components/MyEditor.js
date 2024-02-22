import Editor from "@draft-js-plugins/editor";
import { EditorState, Modifier } from "draft-js";
import React, { useEffect, useRef, useState } from "react";
import { applyStyles } from "./Plugins/applyStyles";

function MyEditor({
  editorState,
  setEditorState,
  retrieveDataFromLocalStorage,
}) {
  const [query, setQuery] = useState("");
  const editorRef = useRef(null);

  const styleMap = {
    COLOR_RED: {
      color: "#ff0000",
    },
    HEADING_ONE: {
      fontSize: "2.125rem",
      fontWeight: "bold",
      color: "#333",
    },
  };

  const onChange = (editorState) => {
    setEditorState(editorState);
  };

  const handleBeforeInput = (chars, editorState) => {
    const currentContent = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const block = currentContent.getBlockForKey(selection.getStartKey());

    if (chars === " ") {
      if (query.endsWith("#")) {
        onChange(applyStyles(editorState, query, setQuery, "HEADING_ONE", "#"));
        return "handled";
      }

      if (query.endsWith("*")) {
        if (query.length === 1) {
          onChange(applyStyles(editorState, query, setQuery, "BOLD", "*"));
          return "handled";
        }
        if (query.length === 2) {
          onChange(
            applyStyles(
              editorState,
              query,
              setQuery,
              "COLOR_RED",
              "**",
              styleMap
            )
          );
          return "handled";
        }
        if (query.length === 3) {
          onChange(
            applyStyles(editorState, query, setQuery, "UNDERLINE", "***")
          );
          return "handled";
        }
      }
    }

    if (chars === "#" || chars === "*") {
      if (chars.length > 0 && chars.length <= 3 && chars.includes("*")) {
        setQuery((prev) => prev + "*");
      } else {
        setQuery((prev) => prev + "#");
      }
    }

    return "not-handled";
  };

  const handleReturn = (event, editorState) => {
    event.preventDefault();

    const currentContent = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const blockKey = selection.getStartKey();
    const block = currentContent.getBlockForKey(blockKey);
    const blockType = block.getType();

    let newContentWithoutHeading = currentContent;

    const editorStateWithNewBlock = EditorState.push(
      editorState,
      newContentWithoutHeading,
      "change-block-type"
    );

    // Move the cursor to the new line
    const contentWithEmptyLine = Modifier.insertText(
      editorStateWithNewBlock.getCurrentContent(),
      editorStateWithNewBlock.getSelection(),
      "\n"
    );

    const editorStateWithEmptyLine = EditorState.push(
      editorStateWithNewBlock,
      contentWithEmptyLine,
      "insert-characters"
    );

    // Reset query
    setQuery("");
    onChange(editorStateWithEmptyLine);
    return "handled";
  };

  useEffect(() => {
    retrieveDataFromLocalStorage();
  }, []);

  return (
    <div className="py-4 border-2 border-[#98bdf2] h-[400px] rounded-[20px] bg-zinc-300 ">
      <Editor
        ref={editorRef}
        editorState={editorState}
        customStyleMap={styleMap}
        onChange={onChange}
        handleBeforeInput={handleBeforeInput}
        handleReturn={handleReturn}
      />
    </div>
  );
}

export default MyEditor;
