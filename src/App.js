import { EditorState, convertFromRaw, convertToRaw } from "draft-js";
import { useEffect, useState } from "react";
import "./App.css";
import Button from "./components/Button.js";
import MyEditor from "./components/MyEditor";
import Title from "./components/Title.js";
import toast, { Toaster } from "react-hot-toast";

function App() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const saveDataToLocalStorage = (editorState) => {
    try {
      const contentState = editorState.getCurrentContent();
      const rawContentState = convertToRaw(contentState);
      const serializedState = JSON.stringify(rawContentState);

      localStorage.setItem("editorState", serializedState);
      toast.success("Saved Successfully");
    } catch (error) {
      console.log("Error while saving data in localstorage", error);
    }
  };

  const retrieveDataFromLocalStorage = () => {
    try {
      const serializedState = localStorage.getItem("editorState");

      if (serializedState === null) {
        setEditorState(EditorState.createEmpty());
        return;
      }

      const rawContentState = JSON.parse(serializedState);
      const contentState = convertFromRaw(rawContentState);

      setEditorState(EditorState.createWithContent(contentState));
    } catch (error) {
      console.log("Error while retrieving data from localStorage", error);
    }
  };

  return (
    <div className="App">
      <div>
        <Toaster />
      </div>
      <div className="px-[35px] mt-[50px]">
        <div className="sm:flex mb-4 ">
          <Title />
          <Button
            editorState={editorState}
            saveDataToLocalStorage={saveDataToLocalStorage}
          />
        </div>
        <div className="flex flex-col items-start text-[14px]">
          <span>
            <b>{`# + space :`}</b>
            {` Add a heading`}
          </span>
          <span>
            <b>{`* + space :`}</b>
            {` Add Bold`}
          </span>
          <span>
            <b>{`** + space :`}</b>
            {` Add red text color`}
          </span>
          <span>
            <b>{`*** + space :`}</b>
            {` Add underline`}
          </span>
        </div>
        <MyEditor
          editorState={editorState}
          setEditorState={setEditorState}
          retrieveDataFromLocalStorage={retrieveDataFromLocalStorage}
        />
      </div>
    </div>
  );
}

export default App;
