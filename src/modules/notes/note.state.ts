import { atom, useAtom } from 'jotai';
import { Note } from './note.entity';

const noteAtom = atom<Note[]>([]);

export const useNoteStore = () => {
  const [notes, setNotes] = useAtom(noteAtom);
  return { notes, setNotes };
};
