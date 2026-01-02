import { atom, useAtom } from 'jotai';
import { Note } from './note.entity';

// このファイルはノートの状態をグローバルステートにしている

// 初期値は空配列
const noteAtom = atom<Note[]>([]);

export const useNoteStore = () => {
  const [notes, setNotes] = useAtom(noteAtom);

  // 新しく追加or更新したいノート配列を受け取る
  const set = (newNotes: Note[]) => {
    // 直前のノート一覧をoldNotesとして受け取る安全な更新方法
    setNotes((oldNotes) => {
      const combineNotes = [...oldNotes, ...newNotes];

      // オブジェクトはkeyが重複すると上書きされる性質があるため、空のオブジェクトを用意している
      const uniqueNotes: { [key: number]: Note } = {};
      // 配列を一つずつ取り出している
      for (const note of combineNotes) {
        // 取り出したnoteを重複するidに上書きしながらオブジェクトに入れている
        // 1: { id: 1, title: "メモ1" },2: { id: 2, title: "メモ2" },2: { id: 2, title: "更新メモ2" }上書きみたいな
        uniqueNotes[note.id] = note;
      }
      // オブジェクトのvalueの部分だけを取り出して配列にしている
      return Object.values(uniqueNotes);
    });
  };

  const deleteNote = (id: number) => {
    const findChildrenIds = (parentId: number): number[] => {
      const childrenIds = notes
        .filter((note) => note.parent_document == parentId)
        .map((child) => child.id);
      // 各小要素に対してさらにその小要素も一致しているものを探す
      return childrenIds.concat(...childrenIds.map((childId) => findChildrenIds(childId)));
    };
    const childrenIds = findChildrenIds(id);
    // 更新用の関数で論理否定でtrueが返ってきている（一致しないもの）だけを返す
    setNotes((oldNotes) => oldNotes.filter((note) => ![...childrenIds, id].includes(note.id)));
  };

  const getOne = (id: number) => notes.find((note) => note.id == id);
  const clear = () => setNotes([]);

  return { getAll: () => notes, set, delete: deleteNote, getOne, clear };
};
