import { Link } from "react-router-dom";
import styles from "../css/components/navbar.module.css";
import sakuraStage from "../assets/images/Sakura Stage (2).png";

function Navbar() {
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
            <Link to="/account">
              <button>Cont</button>
            </Link>
          </div>
        )}

        {isAdmin && (
          <Link to="/admin">
            <button>Admin</button>
          </Link>
        )}

        {token && (
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/";
            }}
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
}

export default Navbar;
