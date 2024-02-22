import { EditorState, Modifier, RichUtils, contentState } from "draft-js";

export const applyStyles = (
  editorState,
  query,
  setQuery,
  styleType,
  identifier,
  styleMap
) => {
  const currentContent = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const block = currentContent.getBlockForKey(selection.getStartKey());

  if (query.endsWith("#") || query.endsWith("*")) {
    const spaceIndex = block.getText().indexOf(identifier);

    let replacementText = "";
    if (spaceIndex !== -1) {
      replacementText = block
        .getText()
        .substring(spaceIndex + identifier.length);
    }

    const newContentState = Modifier.replaceText(
      currentContent,
      selection.merge({
        anchorOffset: spaceIndex,
        focusOffset: selection.getStartOffset(),
      }),
      replacementText,
      editorState.getCurrentInlineStyle()
    );

    const newEditorState = EditorState.push(
      editorState,
      newContentState,
      "replace-text"
    );
    if (styleType === "HEADING_ONE") {
      const headingEditorState = RichUtils.toggleInlineStyle(
        newEditorState,
        styleType
      );
      setQuery("");
      return headingEditorState;
    } else if (styleType === "COLOR_RED") {
      const colorEditorState = RichUtils.toggleInlineStyle(
        newEditorState,
        styleType
      );
      setQuery("");
      return colorEditorState;
    } else {
      const boldEditorState = RichUtils.toggleInlineStyle(
        newEditorState,
        styleType
      );
      setQuery("");
      return boldEditorState;
    }
  }
};
