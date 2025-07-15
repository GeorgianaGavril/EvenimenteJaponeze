import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../Components/Navbar";
import SeatMap from "../Components/SeatMap";
import styles from "../css/pages/tickets.module.css";
import axios from "axios";
import { format } from "date-fns";
import Button from "react-bootstrap/Button";

function Tickets() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [artisti, setArtisti] = useState([]);
  const [modSelectie, setModSelectie] = useState(null);
  const [afiseazaBuy, setAfiseazaBuy] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const [vipCounter, setVipCounter] = useState(0);
  const [standardCounter, setStandardCounter] = useState(0);
  const [lojaCounter, setLojaCounter] = useState(0);
  const [pretTotal, setPretTotal] = useState(0);

  const [vipLocuriMax, setVipLocuriMax] = useState(0);
  const [standardLocuriMax, setStandardLocuriMax] = useState(0);
  const [lojaLocuriMax, setLojaLocuriMax] = useState(0);

  const [locuri, setLocuri] = useState([]);
  const [vipLocuriValabile, setVipLocuriValabile] = useState(0);
  const [lojaLocuriValabile, setLojaLocuriValabile] = useState(0);
  const [standardLocuriValabile, setStandardLocuriValabile] = useState(0);
  const [locuriOcupate, setLocuriOcupate] = useState([]);
  const [locuriDisponibile, setLocuriDisponibile] = useState([]);

  const sectiuneRef = useRef(null);
  const scrollTimeoutRef = useRef(null);

  useEffect(() => {
    async function fetchAll() {
      await getEventById();
      await getAllArtisti();
      await getAllLocuri();
    }
    fetchAll();
  }, []);

  useEffect(() => {
    if (locuri.length && vipLocuriMax && lojaLocuriMax && standardLocuriMax) {
      getBileteForEvent();
    }
  }, [locuri, vipLocuriMax, lojaLocuriMax, standardLocuriMax]);

  useEffect(() => {
    if (pretTotal > 0) {
      setAfiseazaBuy(true);
    }
  }, [pretTotal]);

  useEffect(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      if (sectiuneRef.current) {
        sectiuneRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 300);

    return () => clearTimeout(scrollTimeoutRef.current);
  }, [modSelectie]);

  useEffect(() => {
    if (modSelectie !== null) {
      setVipCounter(0);
      setStandardCounter(0);
      setLojaCounter(0);
      setPretTotal(0);
      setSelectedSeats([]);
      setAfiseazaBuy(false);
    }
  }, [modSelectie]);

  const calculeazaTotal = (lista) => {
    let vip = 0,
      loja = 0,
      standard = 0;

    lista.forEach((seat) => {
      const cod = seat.split("_")[0];
      if (/^R?[1-5]$/.test(cod)) vip++;
      else if (cod.includes("Loja")) loja++;
      else standard++;
    });

    const total =
      vip * event?.pretVIP +
      loja * event?.pretLoja +
      standard * event?.pretStandard;

    setPretTotal(total);
  };

  async function getEventById() {
    try {
      const res = await axios.get(`http://localhost:3004/api/event/${id}`);
      setEvent(res.data);
    } catch (err) {
      console.error("Eroare la returnarea evenimentului: ", err);
    }
  }

  async function getAllArtisti() {
    try {
      const res = await axios.get(
        `http://localhost:3004/api/artistEveniment/event/${id}`
      );
      setArtisti(res.data);
    } catch (err) {
      console.error("Eroare la returnarea artistilor: ", err);
    }
  }

  async function getAllLocuri() {
    try {
      let loja = 0;
      let standard = 0;
      let vip = 0;

      const res = await axios.get(`http://localhost:3004/api/loc/sala/1`);

      res.data.forEach((loc) => {
        if (loc.categorie === "VIP") {
          vip++;
        } else if (loc.categorie === "standard") {
          standard++;
        } else if (loc.categorie === "loja") {
          loja++;
        }
      });

      setLocuri(res.data);
      setLojaLocuriMax(loja);
      setStandardLocuriMax(standard);
      setVipLocuriMax(vip);
    } catch (err) {
      console.error("Eroare la returnarea locurilor cu id 1", err);
    }
  }

  async function getBileteForEvent() {
    try {
      const res = await axios.get(
        `http://localhost:3004/api/bilet/event/${id}`
      );

      const bilete = res.data;
      const locuriDisponibile = locuri.filter(
        (loc) => !bilete.some((bilet) => bilet.locId === loc.id)
      );

      let vip = 0,
        loja = 0,
        standard = 0;

      const locuriOcupateArray = [];

      res.data.forEach((bilet) => {
        const locId = bilet.locId;
        locuri.forEach((loc) => {
          if (locId === loc.id) {
            locuriOcupateArray.push(loc.rand + "_" + loc.scaun);
            if (loc.categorie === "loja") {
              loja++;
            } else if (loc.categorie === "standard") {
              standard++;
            } else if (loc.categorie === "VIP") {
              vip++;
            }
          }
        });
      });

      setLocuriDisponibile(locuriDisponibile);
      setLocuriOcupate(locuriOcupateArray);
      setLojaLocuriValabile(lojaLocuriMax - loja);
      setStandardLocuriValabile(standardLocuriMax - standard);
      setVipLocuriValabile(vipLocuriMax - vip);
    } catch (err) {
      console.error(
        `Eroare la returnarea biletelor la evenimentul cu id ${id}: `,
        err
      );
    }
  }

  const handleModAutomat = () => {
    setModSelectie("automat");
    backToZero();
  };

  const handleModManual = () => {
    setModSelectie("manual");
    backToZero();
  };

  const backToZero = () => {
    setVipCounter(0);
    setStandardCounter(0);
    setLojaCounter(0);
    setPretTotal(0);
  };

  const scadeStandard = function () {
    if (standardCounter) {
      setStandardCounter((prev) => prev - 1);
      setPretTotal((prev) =>
        parseFloat((prev - event?.pretStandard).toFixed(2))
      );
    }
  };

  const scadeLoja = function () {
    if (lojaCounter) {
      setLojaCounter((prev) => prev - 1);
      setPretTotal((prev) => parseFloat((prev - event?.pretLoja).toFixed(2)));
    }
  };

  const scadeVip = function () {
    if (vipCounter) {
      setVipCounter((prev) => prev - 1);
      setPretTotal((prev) => parseFloat((prev - event?.pretVIP).toFixed(2)));
    }
  };

  const addStandard = function () {
    if (!event) return;
    if (standardLocuriValabile > standardCounter) {
      if (pretTotal === 0) {
        setTimeout(scrollDown, 100);
      }
      setStandardCounter((prev) => prev + 1);
      setPretTotal((prev) =>
        parseFloat((prev + event?.pretStandard).toFixed(2))
      );
    }
  };

  const addLoja = function () {
    if (!event) return;
    if (lojaLocuriValabile > lojaCounter) {
      if (pretTotal === 0) {
        setTimeout(scrollDown, 100);
      }
      setLojaCounter((prev) => prev + 1);
      setPretTotal((prev) => parseFloat((prev + event?.pretLoja).toFixed(2)));
    }
  };

  const addVip = function () {
    if (!event) return;
    if (vipLocuriValabile > vipCounter) {
      if (pretTotal === 0) {
        setTimeout(scrollDown, 100);
      }
      setVipCounter((prev) => prev + 1);
      setPretTotal((prev) => parseFloat((prev + event?.pretVIP).toFixed(2)));
    }
  };

  const scrollDown = () => {
    sectiuneRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const alocaAutomat = (locuriDisponibile, numarBilete, categorie) => {
    const locuriSortate = [...locuriDisponibile]
      .filter((loc) => loc.categorie === categorie)
      .sort((a, b) => {
        if (a.rand === b.rand) {
          return a.scaun - b.scaun;
        }
        return a.rand.localeCompare(b.rand);
      });

    for (let i = 0; i <= locuriSortate.length - numarBilete; i++) {
      const grup = locuriSortate.slice(i, i + numarBilete);

      const toateAcelasiRand = grup.every((loc) => loc.rand === grup[0].rand);
      const consecutive = grup.every((loc, idx) => {
        if (idx === 0) return true;
        return loc.scaun === grup[idx - 1].scaun + 1;
      });

      if (toateAcelasiRand && consecutive) {
        return grup;
      }
    }

    return locuriSortate.slice(0, numarBilete);
  };

  const alocaManual = (locuriDisponibile) => {
    const locuriDeCumparat = [];
    locuriDisponibile.forEach((loc) => {
      const randSiScaun = loc.rand + "_" + loc.scaun;
      if (selectedSeats.includes(randSiScaun)) {
        locuriDeCumparat.push(loc);
      }
    });
    return locuriDeCumparat;
  };

  const handleBuy = async () => {
    let bilete = [];
    if (modSelectie === "automat") {
      const vip = alocaAutomat(locuriDisponibile, vipCounter, "VIP");
      const loja = alocaAutomat(locuriDisponibile, lojaCounter, "loja");
      const standard = alocaAutomat(
        locuriDisponibile,
        standardCounter,
        "standard"
      );
      bilete = [...vip, ...loja, ...standard];
    } else {
      bilete = alocaManual(locuriDisponibile);
    }

    const token = localStorage.getItem("token");

    if (!token) {
      localStorage.setItem("redirectToStripe", "true");
      localStorage.setItem(
        "pendingBilete",
        JSON.stringify({
          eventId: event.id,
          lista: bilete,
          pretVIP: event.pretVIP,
          pretStandard: event.pretStandard,
          pretLoja: event.pretLoja,
        })
      );

      navigate(`${window.location.pathname}?login=true`);
      return;
    }

    let email = "";
    try {
      const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
      const decoded = JSON.parse(atob(base64));
      email = decoded.email;
    } catch (err) {
      console.error("Token invalid:", err);
      alert("Sesiune expirată. Te rugăm să te autentifici din nou.");
      localStorage.removeItem("token");
      navigate("/?login=true");
      return;
    }

    try {
      const {
        data: { url, sessionId },
      } = await axios.post("http://localhost:3004/api/stripe/checkout", {
        email,
        eventId: event.id,
        bilete,
        pretVIP: event.pretVIP,
        pretStandard: event.pretStandard,
        pretLoja: event.pretLoja,
      });

      const bileteFinale = bilete.map((loc) => ({
        reservationId: sessionId,
        locId: loc.id,
        userId: 1,
        evenimentId: id,
      }));

      await axios.post("http://localhost:3004/api/bilet/all", {
        bilete: bileteFinale,
      });

      // 3. Redirect către Stripe
      window.location.href = url;
    } catch (err) {
      console.error("Eroare la procesul de cumpărare:", err);
      alert("A apărut o eroare. Vă rugăm să încercați din nou.");
    }
  };

  return (
    <div className={`${styles["event-page"]} ${styles["page-wrapper"]}`}>
      <Navbar />
      <section className={styles.hero}>
        <h1 className={styles.title}>{event?.titlu}</h1>
        <div className={styles.divider}></div>
      </section>

      <section className={styles["event-section"]}>
        <h2>Descriere</h2>
        <p>
          {event?.descriere.split("\n").map((line, i) => (
            <span key={i}>
              {line}
              <br />
            </span>
          ))}
        </p>

        <br></br>
        <h5>
          <strong>Data:</strong>{" "}
          {event?.data && format(new Date(event.data), "dd.MM.yyyy")}
        </h5>

        <h5>
          <strong>Ora: </strong>
          {event?.data.slice(11, 16)}
        </h5>
        <h5>
          <strong>Durată:</strong> {event?.durata} minute
        </h5>
      </section>

      <section className={`${styles["event-section"]} ${styles["light-bg"]}`}>
        <h2>Distribuție</h2>
        <ul>
          {artisti.map((entry) => (
            <li key={entry.id}>
              <strong>{entry.rol}:</strong> {entry.Artist?.nume}{" "}
              {entry.Artist?.prenume}
            </li>
          ))}
        </ul>
      </section>

      <section className={`${styles["buy-type"]} ${styles["method-border"]}`}>
        <h2>Selectați modalitatea de alocare a locurilor:</h2>
        <div className={styles["selection-toggle"]}>
          <label>
            <input
              type="radio"
              value="manual"
              checked={modSelectie === "manual"}
              onChange={handleModManual}
            />
            Selectare manuală
          </label>

          <label>
            <input
              type="radio"
              value="automat"
              checked={modSelectie === "automat"}
              onChange={handleModAutomat}
            />
            Selectare automată
          </label>
        </div>
      </section>

      {modSelectie === "manual" && (
        <div ref={sectiuneRef} className="fade-in">
          <section className={styles["buy-type"]}>
            <ul className={styles["ticket-categories-manual"]}>
              <li>
                <span
                  className={`${styles["category-circle"]} ${styles.vip}`}
                ></span>{" "}
                VIP: {event?.pretVIP} RON ({vipLocuriValabile} / {vipLocuriMax})
              </li>
              <li>
                <span
                  className={`${styles["category-circle"]} ${styles.loja}`}
                ></span>{" "}
                Lojă: {event?.pretLoja} RON ({lojaLocuriValabile} /{" "}
                {lojaLocuriMax})
              </li>
              <li>
                <span
                  className={`${styles["category-circle"]} ${styles.standard}`}
                ></span>{" "}
                Standard: {event?.pretStandard} RON ({standardLocuriValabile} /{" "}
                {standardLocuriMax})
              </li>
            </ul>
          </section>
          <SeatMap
            locuriCumparate={locuriOcupate}
            selectedSeats={selectedSeats}
            setSelectedSeats={setSelectedSeats}
            calculeazaTotal={calculeazaTotal}
          />
        </div>
      )}

      {modSelectie === "automat" && (
        <div
          ref={sectiuneRef}
          className={`${styles["auto-selection"]} ${styles["fade-in"]}`}
        >
          <h2>Alege numărul de bilete</h2>
          <div className={styles["ticket-categories"]}>
            <div className={styles["ticket-category"]}>
              <div className={styles["category-info"]}>
                <span
                  className={`${styles["category-circle"]} ${styles.vip}`}
                ></span>
                <span>
                  VIP - {event?.pretVIP} RON ({vipLocuriValabile} /{" "}
                  {vipLocuriMax})
                </span>
              </div>
              <div className={styles.counter}>
                <button className={styles["counter-btn"]} onClick={scadeVip}>
                  -
                </button>
                <span>{vipCounter}</span>
                <button className={styles["counter-btn"]} onClick={addVip}>
                  +
                </button>
              </div>
            </div>

            <div className={styles["ticket-category"]}>
              <div className={styles["category-info"]}>
                <span
                  className={`${styles["category-circle"]} ${styles.loja}`}
                ></span>
                <span>
                  Lojă - {event?.pretLoja} RON ({lojaLocuriValabile} /{" "}
                  {lojaLocuriMax})
                </span>
              </div>
              <div className={styles.counter}>
                <button className={styles["counter-btn"]} onClick={scadeLoja}>
                  -
                </button>
                <span>{lojaCounter}</span>
                <button className={styles["counter-btn"]} onClick={addLoja}>
                  +
                </button>
              </div>
            </div>

            <div className={styles["ticket-category"]}>
              <div className={styles["category-info"]}>
                <span
                  className={`${styles["category-circle"]} ${styles.standard}`}
                ></span>
                <span>
                  Standard - {event?.pretStandard} RON ({standardLocuriValabile}{" "}
                  / {standardLocuriMax})
                </span>
              </div>
              <div className={styles.counter}>
                <button
                  className={styles["counter-btn"]}
                  onClick={scadeStandard}
                >
                  -
                </button>
                <span>{standardCounter}</span>
                <button className={styles["counter-btn"]} onClick={addStandard}>
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {(afiseazaBuy || selectedSeats.length > 0) && (
        <div
          className={`${styles.buy} ${
            pretTotal > 0 ? styles["fade-in"] : styles["fade-out"]
          }`}
          onAnimationEnd={() => {
            if (pretTotal === 0) setAfiseazaBuy(false);
          }}
        >
          <h2 className={styles["buy-type"]}>
            Preț total: {pretTotal.toFixed(2)} RON
          </h2>
          <Button onClick={handleBuy} className={styles["buy-button"]}>
            Cumpără biletele
          </Button>
        </div>
      )}
    </div>
  );
}

export default Tickets;
