import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Main from "./pages/Main";
import FAQ from "./pages/FAQ";
import GameDetail from "./pages/GameDetail";
import Favorites from "./pages/Favorites";
import Navbar from "./components/Navbar";

function TitleUpdater() {
  const location = useLocation();

  useEffect(() => {
    const pathToTitle = {
      '/': 'Home',
      '/favorites': 'Favorite Teams',
      '/FAQ': 'FAQ'
    };

    if (location.pathname.startsWith('/game/')) {
      document.title = 'Game Details - Rookie Play';
    } else {
      const title = pathToTitle[location.pathname] || 'Rookie Play';
      document.title = `${title} - Rookie Play`;
    }
  }, [location]);

  return null;
}

export default function App() {
  return (
    <div className="min-h-screen">
      <BrowserRouter>
        <TitleUpdater />
        <Navbar />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/FAQ" element={<FAQ />} />
          <Route path="/game/:gameId" element={<GameDetail />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

