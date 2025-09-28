// App.tsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import FileUpload from "./FileUpload";
import Governance from "./Governance";
import { BalanceProvider } from "./BalanceContext";
import "./App.css";

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="app-navigation">
      <div className="nav-container">
        <button className="nav-home-btn" onClick={() => navigate("/")}>
          <span className="nav-icon">🏠</span>
          <span className="nav-text">Home</span>
        </button>
        <div className="nav-links">
          <button
            className={`nav-link ${
              location.pathname === "/upload" ? "active" : ""
            }`}
            onClick={() => navigate("/upload")}
          >
            📁 Upload
          </button>
          <button
            className={`nav-link ${
              location.pathname === "/governance" ? "active" : ""
            }`}
            onClick={() => navigate("/governance")}
          >
            🗳️ Governance
          </button>
        </div>
      </div>
    </nav>
  );
};

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="home-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
      </div>

      <div className="home-content">
        <div className="home-hero">
          <div className="hero-icon">
            <div className="icon-container">
              <div className="main-icon">🚀</div>
              <div className="icon-glow"></div>
            </div>
          </div>
          <h1 className="hero-title">
            Welcome to <span className="gradient-text">DataCoin Portal</span>
          </h1>
          <p className="hero-subtitle">
            Your gateway to decentralized data management and governance
          </p>
        </div>

        <div className="feature-cards">
          <div className="feature-card" onClick={() => navigate("/upload")}>
            <div className="card-icon">📁</div>
            <h3 className="card-title">Upload Data</h3>
            <p className="card-description">
              Securely upload and manage your data with blockchain technology
            </p>
            <button
              className="card-arrow-button"
              aria-label="Go to Upload"
              onClick={(e) => {
                e.stopPropagation();
                navigate("/upload");
              }}
            >
              <span className="card-arrow">→</span>
            </button>
          </div>

          <div className="feature-card" onClick={() => navigate("/governance")}>
            <div className="card-icon">🗳️</div>
            <h3 className="card-title">Governance</h3>
            <p className="card-description">
              Participate in decision-making and shape the platform's future
            </p>
            <button
              className="card-arrow-button"
              aria-label="Go to Governance"
              onClick={(e) => {
                e.stopPropagation();
                navigate("/governance");
              }}
            >
              <span className="card-arrow">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <BalanceProvider>
      <Router>
        <div className="app-wrapper">
          <Navigation />
          <main className="app-main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/upload" element={<FileUpload />} />
              <Route path="/governance" element={<Governance />} />
            </Routes>
          </main>
        </div>
      </Router>
    </BalanceProvider>
  );
}
