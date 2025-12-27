import Layout from './Layout';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NoteDetail from './pages/NoteDetail';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import { Home } from './pages/Home';

function App() {
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
