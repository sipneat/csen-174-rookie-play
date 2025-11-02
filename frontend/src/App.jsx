import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./pages/Main";
import FAQ from "./pages/FAQ";
import GameDetail from "./pages/GameDetail";
import Favorites from "./pages/Favorites";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <div className="min-h-screen">
      <BrowserRouter>
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
