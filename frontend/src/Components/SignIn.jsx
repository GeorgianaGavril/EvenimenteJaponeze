import { useState } from "react";
import styles from "../css/pages/login.module.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

export default function SignIn({ toggle }) {
  const [email, setEmail] = useState("");
  const [parola, setParola] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:3004/api/auth/login", {
        email,
        parola,
      });
      localStorage.setItem("token", res.data.token);
      toast.success("Autentificare reușită!");
      setEmail("");
      setParola("");

      const decoded = JSON.parse(atob(res.data.token.split(".")[1]));
      if (decoded.tip === "admin") {
        // Redirect la panou admin
        navigate("/admin/dashboard");
      } else {
        // Redirect la home sau zona user
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      toast.error("Credențialele sunt incorecte!");
    }
  }

  return (
    <div className={styles["page-wrapper"]}>
      <div className={styles.signin}>
        <div className={styles.left}>
          <h3>Autentificare</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Parolă"
              value={parola}
              onChange={(e) => setParola(e.target.value)}
            />
            <button type="submit">Conectează-te</button>
          </form>
        </div>
        <div className={styles.right}>
          <h1>Bine ai revenit!</h1>
          <br></br>
          <h5>Nu ai cont?</h5>
          <button onClick={toggle}>Înscrie-te aici!</button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
