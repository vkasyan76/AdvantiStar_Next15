import { Extension } from "@tiptap/react"; // Importing Extension from Tiptap to create a custom extension.

declare module "@tiptap/core" {
  // Extending the Tiptap Commands interface to include setLineHeight and unsetLineHeight commands.
  interface Commands<ReturnType> {
    lineHeight: {
      setLineHeight: (lineHeight: string) => ReturnType;
      unsetLineHeight: () => ReturnType;
    };
  }
}

// Defining the custom LineHeightExtension
export const LineHeightExtension = Extension.create({
  name: "lineHeight", // Name of the extension.

  addOptions() {
    // Options for the extension, including the default line-height and types this extension applies to.
    return {
      types: ["paragraph", "heading"], // Nodes where the lineHeight attribute can be applied.
      defaultLineHeight: "normal", // Default line-height value.
    };
  },

  addGlobalAttributes() {
    // Adding global attributes for the specified node types.
    return [
      {
        types: this.options.types, // Applying to the types specified in options.
        attributes: {
          lineHeight: {
            default: this.options.defaultLineHeight, // Setting the default line-height.
            renderHTML: (attributes) => {
              // Rendering the line-height as a CSS style when generating HTML.
              if (!attributes.lineHeight) return {};
              return { style: `line-height: ${attributes.lineHeight}` };
            },
            parseHTML: (element) =>
              // Parsing the line-height value from the element's style attribute.
              element.style.lineHeight || this.options.defaultLineHeight,
          },
        },
      },
    ];
  },

  addCommands() {
    // Adding commands to set and unset the line-height.
    return {
      setLineHeight:
        (lineHeight: string) =>
        ({ tr, state, dispatch }) => {
          const { selection } = state; // Getting the current text selection.
          tr = tr.setSelection(selection); // Ensuring the transaction focuses on the selected text.

          const { from, to } = selection; // Getting the range of the selected text.
          state.doc.nodesBetween(from, to, (node, pos) => {
            // Iterating over nodes in the selection.
            if (this.options.types.includes(node.type.name)) {
              // Checking if the node type matches the types specified in options.
              tr = tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                lineHeight, // Setting the lineHeight attribute.
              });
            }
          });

          if (dispatch) dispatch(tr); // Dispatching the transaction to update the editor.
          return true; // Indicating that the command was executed successfully.
        },

      unsetLineHeight:
        () =>
        ({ tr, state, dispatch }) => {
          const { selection } = state; // Getting the current text selection.
          tr = tr.setSelection(selection); // Ensuring the transaction focuses on the selected text.

          const { from, to } = selection; // Getting the range of the selected text.
          state.doc.nodesBetween(from, to, (node, pos) => {
            // Iterating over nodes in the selection.
            if (this.options.types.includes(node.type.name)) {
              // Checking if the node type matches the types specified in options.
              tr = tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                lineHeight: this.options.defaultLineHeight, // Resetting to the default line-height.
              });
            }
          });

          if (dispatch) dispatch(tr); // Dispatching the transaction to update the editor.
          return true; // Indicating that the command was executed successfully.
        },
    };
  },
});
