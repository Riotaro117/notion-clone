import Layout from './Layout';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NoteDetail from './pages/NoteDetail';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import { Home } from './pages/Home';
import { useEffect, useState } from 'react';
import { useCurrentUserStore } from './modules/auth/current-user.state';
import { authRepository } from './modules/auth/auth.repository';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const currentUserStore = useCurrentUserStore();

  // 一度のみの実行なので関数は中で定義して責任の所在を明確にする
  useEffect(() => {
    const setSession = async () => {
      const currentUser = await authRepository.getCurrentUser();
      currentUserStore.set(currentUser);
      setIsLoading(false);
    };
    setSession();
  }, []);

  // 即時実行関数式
  // useEffect(() => {
  //   (async () => {
  //     const currentUser = await authRepository.getCurrentUser();
  //     currentUserStore.set(currentUser);
  //     setIsLoading(false);
  //   })();
  // }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <div className="h-full">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/notes/:id" element={<NoteDetail />} />
          </Route>
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
