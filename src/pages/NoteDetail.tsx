import Editor from '@/components/Editor';
import { TitleInput } from '@/components/TitleInput';
import { useCurrentUserStore } from '@/modules/auth/current-user.state';
import { noteRepository } from '@/modules/notes/note.repository';
import { useNoteStore } from '@/modules/notes/note.state';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const NoteDetail = () => {
  // URLの末尾を取得するにはuseParamsが使える
  const params = useParams();
  //取得したparams.idは文字列になっているので整数に変換しておく
  const id = parseInt(params.id!);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useCurrentUserStore();
  const noteStore = useNoteStore();
  const note = noteStore.getOne(id);

  useEffect(() => {
    const fetchOne = async () => {
      setIsLoading(true);
      const note = await noteRepository.findOne(currentUser!.id, id);
      if (note == null) return;
      noteStore.set([note]);
      setIsLoading(false);
    };
    fetchOne();
  }, [id]);

  const updateNote = async (id: number, note: { title?: string; content?: string }) => {
    const updatedNote = await noteRepository.update(id, note);
    if (updatedNote == null) return;
    noteStore.set([updatedNote]);
    return updatedNote;
  };

  if (isLoading) return <div>Loading...</div>;
  if (note == null) return <div>note is not existed</div>;
  console.log(note);

  return (
    <div className="pb-40 pt-20">
      <div className="md:max-w-3xl lg:md-max-w-4xl mx-auto">
        <TitleInput initialData={note} onTitleChange={(title) => updateNote(id, { title })} />
        <Editor />
      </div>
    </div>
  );
};

export default NoteDetail;
