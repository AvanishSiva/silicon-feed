import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Home from "./pages/Home";
import ArticlePage from "./pages/ArticlePage";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/articles/:title" element={<ArticlePage />} ></Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;