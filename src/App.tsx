// App.tsx
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import FileUpload from "./FileUpload";
import Governance from "./Governance";
import "./App.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1>Welcome to Our Portal</h1>
      <div className="button-group">
        <button className="primary-btn" onClick={() => navigate("/upload")}>
          Upload Data
        </button>
        <button className="secondary-btn" onClick={() => navigate("/governance")}>
          Enter Governance
        </button>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<FileUpload />} />
        <Route path="/governance" element={<Governance />} />
      </Routes>
    </Router>
  );
};
