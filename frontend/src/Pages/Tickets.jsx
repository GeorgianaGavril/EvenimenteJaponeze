import { useEffect, useRef, useState } from "react";
import Navbar from "../Components/Navbar";
import SeatMap from "../Components/SeatMap";
import "../css/pages/tickets.css";
import axios from "axios";
import { format } from "date-fns";
import Button from "react-bootstrap/Button";

function Tickets() {
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
      const res = await axios.get("http://localhost:3004/api/event/1");
      setEvent(res.data);
    } catch (err) {
      console.error("Eroare la returnarea evenimentului: ", err);
    }
  }

  async function getAllArtisti() {
    try {
      const res = await axios.get("http://localhost:3004/api/artist");
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
      const res = await axios.get("http://localhost:3004/api/bilet/event/1");

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
        "Eroare la returnarea biletelor la evenimentul cu id 1: ",
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
        return grup; // ✅ grupul ideal găsit
      }
    }

    // Dacă nu s-a găsit grup perfect, returnează primele N locuri disponibile
    return locuriSortate.slice(0, numarBilete);
  };

  const handleBuy = () => {
    if (modSelectie === "automat") {
      console.log(
        alocaAutomat(locuriDisponibile, vipCounter, "VIP"),
        alocaAutomat(locuriDisponibile, lojaCounter, "loja"),
        alocaAutomat(locuriDisponibile, standardCounter, "standard")
      );
    }
  };

  async function creareLocuri() {
    const svg = document.getElementById("Sala1");
    const allGroups = svg.querySelectorAll("g[id]");
    const groups = [].slice.call(allGroups, 1);

    const locuri = [];

    groups.forEach((g) => {
      let categorie;
      if (g.id.split("_")[0][0] === "L") {
        categorie = "loja";
      } else if (Number(g.id.split("_")[0].slice(1)) > 5) {
        categorie = "standard";
      } else {
        categorie = "VIP";
      }

      const [rand, scaun] = g.id.split("_");

      locuri.push({
        scaun: parseInt(scaun),
        rand,
        categorie,
        salaId: 1,
      });
    });

    try {
      await axios.post("http://localhost:3004/api/loc/all", locuri);
    } catch (err) {
      console.error("Eroare la bulk create locuri: ", err);
    }
  }

  return (
    <div className="event-page">
      <Navbar />
      <section className="hero">
        <h1 className="title">{event?.titlu}</h1>
        <div className="divider"></div>
      </section>

      <section className="event-section">
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

      <section className="event-section light-bg">
        <h2>Distribuție</h2>
        <ul>
          {artisti
            .filter((artist) => artist.evenimentId === event.id)
            .map((artist) => (
              <li key={artist.id}>
                <strong>
                  {artist.nume} {artist.prenume}:
                </strong>{" "}
                {artist.rol}
              </li>
            ))}
        </ul>
      </section>

      <section className="buy-type method-border">
        <h2>Selectați modalitatea de alocare a locurilor:</h2>
        <div className="selection-toggle">
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
          <section className="buy-type">
            <ul className="ticket-categories-manual">
              <li>
                <span className="category-circle vip"></span> VIP:{" "}
                {event?.pretVIP} RON ({vipLocuriValabile} / {vipLocuriMax})
              </li>
              <li>
                <span className="category-circle loja"></span> Lojă:{" "}
                {event?.pretLoja} RON ({lojaLocuriValabile} / {lojaLocuriMax})
              </li>
              <li>
                <span className="category-circle standard"></span> Standard:{" "}
                {event?.pretStandard} RON ({standardLocuriValabile} /{" "}
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
        <div ref={sectiuneRef} className="auto-selection fade-in">
          <h2>Alege numărul de bilete</h2>
          <div className="ticket-categories">
            <div className="ticket-category">
              <div className="category-info">
                <span className="category-circle vip"></span>
                <span>
                  VIP - {event?.pretVIP} RON ({vipLocuriValabile} /{" "}
                  {vipLocuriMax})
                </span>
              </div>
              <div className="counter">
                <button className="counter-btn" onClick={scadeVip}>
                  -
                </button>
                <span>{vipCounter}</span>
                <button className="counter-btn" onClick={addVip}>
                  +
                </button>
              </div>
            </div>

            <div className="ticket-category">
              <div className="category-info">
                <span className="category-circle loja"></span>
                <span>
                  Lojă - {event?.pretLoja} RON ({lojaLocuriValabile} /{" "}
                  {lojaLocuriMax})
                </span>
              </div>
              <div className="counter">
                <button className="counter-btn" onClick={scadeLoja}>
                  -
                </button>
                <span>{lojaCounter}</span>
                <button className="counter-btn" onClick={addLoja}>
                  +
                </button>
              </div>
            </div>

            <div className="ticket-category">
              <div className="category-info">
                <span className="category-circle standard"></span>
                <span>
                  Standard - {event?.pretStandard} RON ({standardLocuriValabile}{" "}
                  / {standardLocuriMax})
                </span>
              </div>
              <div className="counter">
                <button className="counter-btn" onClick={scadeStandard}>
                  -
                </button>
                <span>{standardCounter}</span>
                <button className="counter-btn" onClick={addStandard}>
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {(afiseazaBuy || selectedSeats.length > 0) && (
        <div
          className={`buy ${pretTotal > 0 ? "fade-in" : "fade-out"}`}
          onAnimationEnd={() => {
            if (pretTotal === 0) setAfiseazaBuy(false);
          }}
        >
          <h2 className="buy-title">Preț total: {pretTotal.toFixed(2)} RON</h2>
          <Button onClick={handleBuy} className="buy-button">
            Cumpără biletele
          </Button>
        </div>
      )}

      {/* <Button onClick={creareLocuri}>Trimite locurile în baza de date</Button> */}
    </div>
  );
}

export default Tickets;
