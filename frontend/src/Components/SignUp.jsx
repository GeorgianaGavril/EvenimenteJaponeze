import React, { useState } from "react";
import styles from "../css/pages/login.module.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
        localStorage.setItem("token", res.data.token);
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
              <input
                type="text"
                name="nume"
                placeholder="Nume"
                value={nume}
                onChange={(e) => setNume(e.target.value)}
              />
              {erori.nume && <small>{erori.nume}</small>}
            </div>
            <div className={styles["form-group"]}>
              <input
                type="text"
                name="prenume"
                placeholder="Prenume"
                value={prenume}
                onChange={(e) => setPrenume(e.target.value)}
              />
              {erori.prenume && <small>{erori.prenume}</small>}
            </div>
            <div className={styles["form-group"]}>
              <input
                type="text"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {erori.email && <small>{erori.email}</small>}
            </div>
            <div className={styles["form-group"]}>
              <input
                type="password"
                name="parola"
                placeholder="Parolă"
                value={parola}
                onChange={(e) => setParola(e.target.value)}
              />
              {erori.parola && <small>{erori.parola}</small>}
            </div>
            <div className={styles["form-group"]}>
              <input
                type="password"
                name="confirmaParola"
                placeholder="Confirmă parola"
                value={confirmaParola}
                onChange={(e) => setConfirmaParola(e.target.value)}
              />
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
