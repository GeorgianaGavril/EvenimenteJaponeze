import { Link } from "react-router-dom";
import styles from "../css/components/navbar.module.css";
import sakuraStage from "../assets/images/Sakura Stage (3).png";
import Login from "../Pages/Login";
import { useState } from "react";

function Navbar() {
  const [showLogin, setShowLogin] = useState(false);

  const token = localStorage.getItem("token");
  let isAdmin = false;

  if (token) {
    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      isAdmin = decoded.tip === "admin";
    } catch {}
  }

  return (
    <div className={styles.navbar}>
      <div>
        <img src={sakuraStage} width={150} alt="Logo" />
      </div>
      <div className={styles.pages}>
        {!isAdmin && (
          <div>
            <Link to="/">
              <button>Acasă</button>
            </Link>
            <Link to="/calendar">
              <button>Calendar</button>
            </Link>
            <>
              <button onClick={() => setShowLogin(true)}>Autentificare</button>
              <Login show={showLogin} onClose={() => setShowLogin(false)} />
            </>
          </div>
        )}

        {isAdmin && (
          <div>
            <Link to="/dashboard">
              <button>Dashboard</button>
            </Link>
            <Link to="/statistics">
              <button>Statistici</button>
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/";
              }}
            >
              Logout
            </button>
          </div>
        )}

        {/* {token && (
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/";
            }}
          >
            Logout
          </button>
        )} */}
      </div>
    </div>
  );
}

export default Navbar;
