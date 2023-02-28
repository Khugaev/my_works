import React, { useRef, useCallback } from "react";
import { EDITOR_JS_TOOLS } from "../utils/tools";
import { createReactEditorJS } from "react-editor-js";
import {useDispatch} from "react-redux";
import {postEditorChange} from "../store/actions/postAction";

export default function Editor({ data, setData }) {
  const editorCore = useRef(null);
  const ReactEditorJS = createReactEditorJS();
  const dispatch = useDispatch()
  const handleInitialize = useCallback((instance) => {
    instance._editorJS.isReady
      .then(async () => {
        editorCore.current = instance;
        const savedData = await editorCore.current.save();
        dispatch(postEditorChange({...data, text: savedData}))
      })
      .catch((err) => console.log("An error occured", err));
  }, []);

  const handleSave = useCallback(async () => {
    const savedData = await editorCore.current.save();
    dispatch(postEditorChange({...data, text: savedData}))
  }, [dispatch]);
  return (
    <div className="editor-container">
      <ReactEditorJS
        onInitialize={handleInitialize}
        tools={EDITOR_JS_TOOLS}
        onChange={handleSave}
        defaultValue={data.text}
      />
    </div>
  );
}
