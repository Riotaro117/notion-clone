import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import SideBar from './components/SideBar';
import { SearchModal } from './components/SearchModal';
import { useCurrentUserStore } from './modules/auth/current-user.state';
import { useNoteStore } from './modules/notes/note.state';
import { useEffect, useState } from 'react';
import { noteRepository } from './modules/notes/note.repository';
import { Note } from './modules/notes/note.entity';

const Layout = () => {
  const navigate = useNavigate();
  // 分割代入でcurrentUserのみを取り出している
  const { currentUser } = useCurrentUserStore();
  const noteStore = useNoteStore();
  const [isLoading, setIsLoading] = useState(false);
  //モーダルの開閉の状態
  const [isShowModal, setIsShowModal] = useState(false);
  //検索結果の状態
  const [searchResult, setSearchResult] = useState<Note[]>([]);

  // ログイン状態が変更されるたびに実行されるように
  useEffect(() => {
    if (!currentUser) return;
    const loadNotes = async () => {
      setIsLoading(true);
      const notes = await noteRepository.find(currentUser.id);
      if (notes) {
        noteStore.set(notes);
      }
      setIsLoading(false);
    };
    loadNotes();
  }, [currentUser]);

  const searchNotes = async (keyword: string) => {
    const notes = await noteRepository.findByKeyword(currentUser!.id, keyword);
    if (notes == null) return;
    noteStore.set(notes);
    setSearchResult(notes);
  };

  const moveToDetail = (noteId: number) => {
    navigate(`/notes/${noteId}`);
    setIsShowModal(false);
  };

  if (currentUser == null) {
    return <Navigate replace to="/signin" />;
  }

  return (
    <div className="h-full flex">
      {!isLoading && <SideBar onSearchButtonClicked={() => setIsShowModal(true)} />}
      <main className="flex-1 h-full overflow-y-auto">
        <Outlet />
        <SearchModal
          isOpen={isShowModal}
          notes={searchResult}
          onItemSelect={moveToDetail}
          onKeywordChanged={searchNotes}
          onClose={() => setIsShowModal(false)}
        />
      </main>
    </div>
  );
};

export default Layout;
