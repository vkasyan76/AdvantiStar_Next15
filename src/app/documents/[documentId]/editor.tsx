"use client";
import { Color } from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import Image from "@tiptap/extension-image";
import ImageResize from "tiptap-extension-resize-image";
import Underline from "@tiptap/extension-underline";
import FontFamily from "@tiptap/extension-font-family";
import TextStyle from "@tiptap/extension-text-style";
import { FontSizeExtension } from "@/extensions/font-size";
import { LineHeightExtension } from "@/extensions/line-height";

import { useEditorStore } from "@/store/use-editor-store";
import { Ruler } from "./ruler";

export const Editor = () => {
  const { setEditor } = useEditorStore();

  // This component initializes the Tiptap editor and stores the Editor instance in the Zustand store.
  // The onCreate method is part of the configuration options for the useEditor hook provided by @tiptap/react.
  // A lifecycle method triggered when the editor is created.
  // Inside onCreate, the editor instance is passed to the setEditor function, which updates the Zustand state defined in src\store\use-editor-store.ts.
  const editor = useEditor({
    immediatelyRender: false, // Disable SSR rendering for hydration compatibility
    onCreate({ editor }) {
      setEditor(editor);
    },
    // unmount the Editor, clean the global state
    onDestroy() {
      setEditor(null);
    },
    // To ensure that the global Zustand state (editor) remains in sync with the actual editor instance.
    onUpdate({ editor }) {
      setEditor(editor);
    },
    onSelectionUpdate({ editor }) {
      setEditor(editor);
    },
    onTransaction({ editor }) {
      setEditor(editor);
    },
    onFocus({ editor }) {
      setEditor(editor);
    },
    onBlur({ editor }) {
      setEditor(editor);
    },
    onContentError({ editor }) {
      setEditor(editor);
    },

    editorProps: {
      attributes: {
        style: "padding-left: 56px; padding-right: 56px;",
        class:
          "focus:outline-none print:border-0 bg-white border border-[#C7C7C7] flex flex-col min-h-[1054px] w-[816px] pt-10 pr-14 pb-10 cursor-text",
      },
    },
    extensions: [
      StarterKit,
      FontSizeExtension, // Add custom font size extension
      LineHeightExtension.configure({
        types: ["heading", "paragraph"],
        defaultLineHeight: "normal",
      }), // Add custom line height extension
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),
      Color,
      Highlight.configure({ multicolor: true }),
      FontFamily,
      TextStyle,
      Underline,
      Image,
      ImageResize,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    // content: "<p>Hello World! 🌎️</p>",
    // content: `
    //     <table>
    //       <tbody>
    //         <tr>
    //           <th>Name</th>
    //           <th colspan="3">Description</th>
    //         </tr>
    //         <tr>
    //           <td>Cyndi Lauper</td>
    //           <td>Singer</td>
    //           <td>Songwriter</td>
    //           <td>Actress</td>
    //         </tr>
    //       </tbody>
    //     </table>
    //   `,
  });

  return (
    <div className="size-full overflow-x-auto bg-[#F9FBFD] px-4 print:p-0 print:bg-white print:overflow-visible">
      <Ruler />
      <div className="min-w-max flex justify-center w-[816px] py-4 print:py-0 mx-auto print:w-full print:min-w-0">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};
