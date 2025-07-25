import SignIn from "../Components/SignIn";
import SignUp from "../Components/SignUp";
import styles from "../css/pages/loginModal.module.css";
import { useState } from "react";

export default function Login({ show, onClose }) {
  const [signUp, setSignUp] = useState(false);

  if (!show) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={`${styles.modal} ${
          window.innerWidth > 768 ? styles.animated : ""
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {signUp ? (
          <SignUp toggle={() => setSignUp(false)} />
        ) : (
          <SignIn toggle={() => setSignUp(true)} onClose={onClose} />
        )}
        <button className={styles.close} onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  );
}
