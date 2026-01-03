// import { BlockNoteEditor, PartialBlock } from '@blocknote/core';
import { useCreateBlockNote } from '@blocknote/react';
import '@blocknote/mantine/style.css';
import { BlockNoteView } from '@blocknote/mantine';
// import { ja } from '@blocknote/core/locales';
import { locales } from '@blocknote/core';

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string | null;
}

function Editor({ onChange, initialContent }: EditorProps) {
  const editor = useCreateBlockNote({
    dictionary: locales.ja,
    initialContent: initialContent != null ? JSON.parse(initialContent) : undefined, //初期値の設定
  });
  console.log(editor)
  return (
    <div>
      <BlockNoteView editor={editor} onChange={() => onChange(JSON.stringify(editor.document))} />
    </div>
  );
}

export default Editor;
