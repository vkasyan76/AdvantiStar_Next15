import { create } from "zustand";
import { type Editor } from "@tiptap/react";

interface EditorState {
  editor: Editor | null;
  setEditor: (editor: Editor | null) => void;
}

// Store Creation: The editor property starts as null (no editor instance set).
// Global Access: You can access editor and setEditor from anywhere in your application using
export const useEditorStore = create<EditorState>((set) => ({
  editor: null,
  setEditor: (editor) => set({ editor }),
}));

// Zustand is a lightweight state management library for React.
// It simplifies creating a global or shared state using hooks like useEditorStore.
