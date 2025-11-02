import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./pages/Main";
import About from "./pages/About";
import FAQ from "./pages/FAQ";

export default function App() {
  let chat = "hello";

  return (
    <div className="min-h-screen">
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<Main />} />
            <Route path="about" element={<About />} />
            <Route path="FAQ" element={<FAQ />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
