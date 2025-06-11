import { Link } from "react-router-dom";
import styles from "../css/components/navbar.module.css";
import sakuraStage from "../assets/images/Sakura Stage (1).png";

function Navbar() {
  return (
    <div className={styles.navbar}>
      <div>
        <img src={sakuraStage} width={150} alt="Logo" />
      </div>
      <div className={styles.pages}>
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
    </div>
  );
}

export default Navbar;
