import React from "react";

export default function Button({ editorState, saveDataToLocalStorage }) {
  return (
    <div
      onClick={() => saveDataToLocalStorage(editorState)}
      className="border-2 border-[#000000] px-6 py-2 font-bold shadow-xl cursor-pointer hover:bg-[#dadada]"
    >
      Save
    </div>
  );
}
