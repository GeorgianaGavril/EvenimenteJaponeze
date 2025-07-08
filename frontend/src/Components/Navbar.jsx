import { Link, useNavigate } from "react-router-dom";
import styles from "../css/components/navbar.module.css";
import sakuraStage from "../assets/images/Sakura Stage (3).png";
import Login from "../Pages/Login";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function Navbar() {
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("login") === "true") {
      setShowLogin(true);
    }
  }, [location.search]);

  useEffect(() => {
    const handleLogin = () => {
      const u = getUserFromToken();
      setUser(u);
      setLoading(false); // ✅
    };

    window.addEventListener("loginSuccess", handleLogin);
    handleLogin(); // ✅ apel inițial

    return () => {
      window.removeEventListener("loginSuccess", handleLogin);
    };
  }, []);

  function getUserFromToken() {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
      const decoded = JSON.parse(atob(base64));
      return decoded;
    } catch {
      return null;
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    window.location.href = "/";
  }

  return (
    <div className={styles.navbar}>
      <div className={styles.left}>
        <img src={sakuraStage} width={150} alt="Logo" />
      </div>

      <button
        className={styles["mobile-toggle"]}
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        ☰
      </button>

      {!loading && (
        <div
          className={`${styles.pages} ${
            mobileMenuOpen ? styles.open : styles.closed
          }`}
        >
          {user?.tip === "admin" ? (
            <>
              <Link to="/admin/dashboard">
                <button>Dashboard</button>
              </Link>
              <Link to="/statistics">
                <button>Statistici</button>
              </Link>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/">
                <button>Acasă</button>
              </Link>
              <Link to="/calendar">
                <button>Calendar</button>
              </Link>
              {user ? (
                <button onClick={handleLogout}>Logout</button>
              ) : (
                <>
                  <button onClick={() => setShowLogin(true)}>
                    Autentificare
                  </button>
                  <Login show={showLogin} onClose={() => setShowLogin(false)} />
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Navbar;
