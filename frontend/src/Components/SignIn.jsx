import { useState } from "react";
import "../css/pages/login.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SignIn({ toggle }) {
  const [email, setEmail] = useState("");
  const [parola, setParola] = useState("");

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
    } catch (err) {
      console.error(err);
      toast.error("Credențialele sunt incorecte!");
    }
  }

  return (
    <>
      <div className="signin">
        <div className="left">
          <h3>Autentificare</h3>
          <form onSubmit={(e) => handleSubmit(e)}>
            <input
              className="form-group"
              type="text"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="form-group"
              type="password"
              name="parola"
              placeholder="Parolă"
              value={parola}
              onChange={(e) => setParola(e.target.value)}
            />
            <button>Conectează-te</button>
          </form>
        </div>
        <div className="right">
          <h1>Bine ai revenit!</h1>
          <br></br>
          <h5>Nu ai cont?</h5>
          <button onClick={toggle}>Înscrie-te aici!</button>
        </div>
      </div>

      <div>
        <ToastContainer />
      </div>
    </>
  );
}
