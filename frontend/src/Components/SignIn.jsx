import { useState } from "react";
import styles from "../css/pages/login.module.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";

export default function SignIn({ toggle, onClose }) {
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

      const token = res.data.token;
      if (!token) {
        toast.error("Token inexistent!");
        return;
      }

      localStorage.setItem("token", token);

      const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
      const decoded = JSON.parse(atob(base64));
      localStorage.setItem("user", JSON.stringify(decoded));

      // ...
      toast.success("Autentificare reușită!");
      setEmail("");
      setParola("");

      // verifici dacă există o cerere de cumpărare anterioară
      const redirectToStripe = localStorage.getItem("redirectToStripe");
      const pendingBilete = localStorage.getItem("pendingBilete");

      if (redirectToStripe && pendingBilete) {
        try {
          const bileteData = JSON.parse(pendingBilete);

          const stripeRes = await axios.post(
            "http://localhost:3004/api/stripe/checkout",
            {
              email,
              eventId: bileteData.eventId,
              bilete: bileteData.lista,
              pretVIP: bileteData.pretVIP,
              pretStandard: bileteData.pretStandard,
              pretLoja: bileteData.pretLoja,
            }
          );

          const {
            data: { url, sessionId },
          } = stripeRes;

          await axios.post("http://localhost:3004/api/bilet/all", {
            bilete: bileteData.lista.map((loc) => ({
              reservationId: sessionId,
              locId: loc.id,
              userId: decoded.id,
              evenimentId: bileteData.eventId,
            })),
          });

          localStorage.removeItem("redirectToStripe");
          localStorage.removeItem("pendingBilete");

          window.location.href = url;
          return;
        } catch (err) {
          toast.error("Eroare la redirecționare către Stripe!");
          console.error(err);
        }
      } else {
        window.dispatchEvent(new Event("loginSuccess")); // 👈 adaugă asta!

        if (decoded.tip === "admin") {
          navigate("/admin/dashboard");
        } else {
          onClose?.(); // 👈 închide modala
          navigate(window.location.pathname); // 👈 rămâi pe pagina curentă
        }

        const url = new URL(window.location.href);
        url.searchParams.delete("login");
        window.history.replaceState({}, "", url);
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
            <div className={styles["input-wrapper"]}>
              <Mail className={styles["icon"]} />
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className={styles["input-wrapper"]}>
              <Lock className={styles["icon"]} />
              <input
                type="password"
                placeholder="Parolă"
                value={parola}
                onChange={(e) => setParola(e.target.value)}
              />
            </div>
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
