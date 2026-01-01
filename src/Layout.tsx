import { Navigate, Outlet } from 'react-router-dom';
import SideBar from './components/SideBar';
import { SearchModal } from './components/SearchModal';
import { useCurrentUserStore } from './modules/auth/current-user.state';
import { useNoteStore } from './modules/notes/note.state';
import { useEffect, useState } from 'react';
import { noteRepository } from './modules/notes/note.repository';

const Layout = () => {
  // 分割代入でcurrentUserのみを取り出している
  const { currentUser } = useCurrentUserStore();
  const noteStore = useNoteStore();
  const [isLoading, setIsLoading] = useState(false);
  //モーダルの開閉の状態
  const [isShowModal, setIsShowModal] = useState(false);

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
          notes={[]}
          onItemSelect={() => {}}
          onKeywordChanged={() => {}}
          onClose={() => setIsShowModal(false)}
        />
      </main>
    </div>
  );
};

export default Layout;
