import { cn } from '@/lib/utils';
import { NoteItem } from './NoteItem';
import { useNoteStore } from '@/modules/notes/note.state';
import { useCurrentUserStore } from '@/modules/auth/current-user.state';
import { noteRepository } from '@/modules/notes/note.repository';
import { Note } from '@/modules/notes/note.entity';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface NoteListProps {
  layer?: number;
  parentId?: number;
}

export function NoteList({ layer = 0, parentId }: NoteListProps) {
  //動的にURLを取得するためのもの
  const params = useParams();
  const id = params.id != null ? parseInt(params.id) : undefined;
  //動的にURLを遷移させるもの
  const navigate = useNavigate();
  const noteStore = useNoteStore();
  const notes = noteStore.getAll();
  const { currentUser } = useCurrentUserStore();
  // ページの何層目まで開いている状態なのか {1:true,2:false}
  const [expanded, setExpanded] = useState<Map<number, boolean>>(new Map());

  // ノートの小要素の作成
  const createChild = async (e: React.MouseEvent, parentId: number) => {
    //バブリング防止
    e.stopPropagation();
    const newNote = await noteRepository.create(currentUser!.id, { parentId });
    noteStore.set([newNote]);
    setExpanded((prev) => prev.set(parentId, true));
    moveToDetail(newNote.id);
  };

  // ノートの小要素の取得
  const fetchChildren = async (e: React.MouseEvent, note: Note) => {
    e.stopPropagation();
    const children = await noteRepository.find(currentUser!.id, note.id);
    if (children == null) return;
    noteStore.set(children);

    setExpanded((prev) => {
      const newExpanded = new Map(prev);
      newExpanded.set(note.id, !prev.get(note.id));
      return newExpanded;
    });
  };

  // ノートの削除
  const deleteNote = async (e: React.MouseEvent, noteId: number) => {
    e.stopPropagation();
    await noteRepository.delete(noteId);
    noteStore.delete(noteId);
    navigate('/');
  };

  // ページを遷移する
  const moveToDetail = (noteId: number) => {
    navigate(`/notes/${noteId}`);
  };

  return (
    <>
      <p
        className={cn(
          `hidden text-sm font-medium text-muted-foreground/80`,
          layer === 0 && 'hidden'
        )}
        // layerが深くなればなるほどpadding-leftが大きくなっていく
        style={{ paddingLeft: layer ? `${layer * 12 + 25}px` : undefined }}
      >
        ページがありません
      </p>
      {/* filterがあるので無限ループにならない */}
      {notes
        .filter((note) => note.parent_document == parentId)
        .map((note) => {
          return (
            <div key={note.id}>
              <NoteItem
                note={note}
                layer={layer}
                isSelected={id == note.id}
                expanded={expanded.get(note.id)}
                onClick={() => moveToDetail(note.id)}
                onExpand={(e: React.MouseEvent) => fetchChildren(e, note)}
                onCreate={(e) => createChild(e, note.id)}
                onDelete={(e) => deleteNote(e, note.id)}
              />
              {/* 以下は自分をもう一度呼び出す再帰処理。ノートの小要素をlayerでどんどん深くしていく */}
              {expanded.get(note.id) && <NoteList layer={layer + 1} parentId={note.id} />}
            </div>
          );
        })}
    </>
  );
}
