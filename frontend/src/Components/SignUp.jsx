import React, { useState } from "react";
import styles from "../css/pages/login.module.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { User, Mail, Lock, ShieldCheck } from "lucide-react";

export default function SignUp({ toggle }) {
  const [nume, setNume] = useState("");
  const [prenume, setPrenume] = useState("");
  const [email, setEmail] = useState("");
  const [parola, setParola] = useState("");
  const [confirmaParola, setConfirmaParola] = useState("");

  const [erori, setErori] = useState({});

  const validateForm = () => {
    const errObj = {};
    if (!nume.trim() || !nume.match("^[a-zA-Z -]+$")) {
      errObj.nume = "Nume invalid!";
    }

    if (!prenume.trim() || !prenume.match("^[a-zA-Z -]+$")) {
      errObj.prenume = "Prenume invalid!";
    }

    if (!email.trim() || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errObj.email = "Email invalid!";
    }

    if (parola.trim().length < 5) {
      errObj.parola = "Parola trebuie sa aiba minim 5 caractere!";
    }

    if (confirmaParola.trim() !== parola.trim()) {
      errObj.confirmaParola = "Parola nu este identică!";
    }

    setErori(errObj);
    return Object.keys(errObj).length;
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateForm()) {
      try {
        const res = await axios.post("http://localhost:3004/api/auth/sign-up", {
          nume,
          prenume,
          email,
          parola,
          confirmaParola,
          tip: "userObisnuit",
        });
        const token = res.data.token;
        if (!token) {
          toast.error("Token inexistent!");
          return;
        }

        localStorage.setItem("token", token);

        const base64 = token
          .split(".")[1]
          .replace(/-/g, "+")
          .replace(/_/g, "/");
        const decoded = JSON.parse(atob(base64));
        localStorage.setItem("user", JSON.stringify(decoded));

        toast.success("Cont realizat cu succes!");
        setNume("");
        setPrenume("");
        setEmail("");
        setParola("");
        setConfirmaParola("");
      } catch (err) {
        console.error(err);
        toast.error("Eroare la crearea contului!");
      }
    } else {
      console.log("Eroare la completarea datelor!");
    }
  }

  return (
    <div className={styles["page-wrapper"]}>
      <div className={`${styles.signin} ${styles.signup}`}>
        <div className={styles.left}>
          <h1>Bine ai venit!</h1>
          <br></br>
          <h5>Ai deja cont?</h5>
          <button onClick={toggle}>Autentificare</button>
        </div>
        <div className={styles.right}>
          <h3>Creare cont</h3>
          <form onSubmit={handleSubmit}>
            <div className={styles["form-group"]}>
              <div className={styles["input-wrapper"]}>
                <User className={styles["icon"]} />
                <input
                  type="text"
                  name="nume"
                  placeholder="Nume"
                  value={nume}
                  onChange={(e) => setNume(e.target.value)}
                />
              </div>
              {erori.nume && <small>{erori.nume}</small>}
            </div>

            <div className={styles["form-group"]}>
              <div className={styles["input-wrapper"]}>
                <User className={styles["icon"]} />
                <input
                  type="text"
                  name="prenume"
                  placeholder="Prenume"
                  value={prenume}
                  onChange={(e) => setPrenume(e.target.value)}
                />
              </div>
              {erori.prenume && <small>{erori.prenume}</small>}
            </div>

            <div className={styles["form-group"]}>
              <div className={styles["input-wrapper"]}>
                <Mail className={styles["icon"]} />
                <input
                  type="text"
                  name="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {erori.email && <small>{erori.email}</small>}
            </div>

            <div className={styles["form-group"]}>
              <div className={styles["input-wrapper"]}>
                <Lock className={styles["icon"]} />
                <input
                  type="password"
                  name="parola"
                  placeholder="Parolă"
                  value={parola}
                  onChange={(e) => setParola(e.target.value)}
                />
              </div>
              {erori.parola && <small>{erori.parola}</small>}
            </div>

            <div className={styles["form-group"]}>
              <div className={styles["input-wrapper"]}>
                <ShieldCheck className={styles["icon"]} />
                <input
                  type="password"
                  name="confirmaParola"
                  placeholder="Confirmă parola"
                  value={confirmaParola}
                  onChange={(e) => setConfirmaParola(e.target.value)}
                />
              </div>
              {erori.confirmaParola && <small>{erori.confirmaParola}</small>}
            </div>
            <button type="submit">Înscrie-te</button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
