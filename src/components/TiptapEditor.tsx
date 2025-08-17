import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Italic,
  Strikethrough,
  Undo,
  Redo,
  List,
  ListOrdered,
  Quote,
  RemoveFormatting,
} from "lucide-react";

interface TiptapEditorProps {
  value: string;
  onChange: (content: string) => void;
}

const TiptapEditor = ({ value, onChange }: TiptapEditorProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return <div className="border p-2 rounded-md">Loading...</div>;

  return (
    <div className="border rounded-md">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 my-2 border-b pb-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          className="p-1"
        >
          <Undo size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          className="p-1"
        >
          <Redo size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={
            editor.isActive("bold") ? "border border-white p-1 rounded" : "p-1"
          }
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={
            editor.isActive("italic") ? "border border-white p-1 rounded" : "p-1"
          }
        >
          <Italic size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={
            editor.isActive("strike") ? "border border-white p-1 rounded" : "p-1"
          }
        >
          <Strikethrough size={16} />
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={
            editor.isActive("heading", { level: 1 })
              ? "border border-white p-1 rounded"
              : "p-1"
          }
        >
          H1
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={
            editor.isActive("heading", { level: 2 })
              ? "border border-white p-1 rounded"
              : "p-1"
          }
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={
            editor.isActive("bulletList") ? "border border-white p-1 rounded" : "p-1"
          }
        >
          <List size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={
            editor.isActive("orderedList") ? "border border-white p-1 rounded" : "p-1"
          }
        >
          <ListOrdered size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={
            editor.isActive("blockquote") ? "border border-white p-1 rounded" : "p-1"
          }
        >
          <Quote size={16} />
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().unsetAllMarks().setParagraph().run()
          }
          className="p-1"
        >
          <RemoveFormatting size={16} />
        </button>
      </div>

      {/* Editor Content */}
      <EditorContent
        editor={editor}
        className="prose max-w-none min-h-[200px] p-2"
      />
    </div>
  );
};

export default TiptapEditor;
