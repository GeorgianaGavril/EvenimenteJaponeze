import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Navbar from "../Components/Navbar";
import styles from "../css/pages/home.module.css";
import sakuraImg from "../assets/images/Sakura branch cream.png";
import cardImg1 from "../assets/images/213.jpg";
import cardImg2 from "../assets/images/43078.jpg";
import cardImg3 from "../assets/images/7032.jpg";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Home() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAllEvents();
  }, []);

  const getAllEvents = async () => {
    try {
      const res = await axios.get("http://localhost:3004/api/event");
      const spectacoleViitoare = res.data
        .filter((ev) => new Date(ev.data) > new Date())
        .sort((a, b) => new Date(a.data) - new Date(b.data))
        .slice(0, 3);
      setEvents(spectacoleViitoare);
    } catch (err) {
      console.error(err.message);
    }
  };

  function scurteazaText(text, maxLength = 100) {
    if (text) {
      if (text.length <= maxLength) return text;
      return text.slice(0, text.lastIndexOf(" ", maxLength)) + "...";
    }
  }

  return (
    <div className={styles["page-wrapper"]}>
      <Navbar />

      <section className={styles["intro-section"]}>
        <div className={styles["welcome"]}>
          <h1
            style={{
              backgroundColor: "#e2c9dc",
              display: "inline-block",
              padding: "0 10px",
              borderRadius: "10px",
            }}
          >
            よこそう
          </h1>

          <h3>Descoperă spectacolele tradiționale japoneze</h3>
          <Button variant="primary" onClick={() => navigate("/calendar")}>
            Vezi evenimentele
          </Button>
        </div>

        <div className={`col-md-6 text-center ${styles["sakura-pic"]}`}>
          <img
            src={sakuraImg}
            alt="Sakura"
            className="img-fluid rounded"
            width={600}
            style={{ maxWidth: "100%" }}
          />
        </div>
      </section>

      <section className={styles["showcase-section"]}>
        <div className={styles["section-header"]}>
          <h2>Spectacole viitoare</h2>
          <div className={styles.divider}></div>
        </div>

        <div className={styles["card-container"]}>
          {events.slice(0, 3).map((ev, idx) => (
            <Card
              key={ev.id}
              className={`${styles["show-cards"]} ${
                idx === 1 ? styles.card2 : ""
              }`}
            >
              <Card.Img
                variant="top"
                src={[cardImg1, cardImg2, cardImg3][idx]}
              />
              <Card.Body>
                <Card.Title>{ev.titlu}</Card.Title>
                <Card.Text>{scurteazaText(ev.descriere)}</Card.Text>
                <Button
                  variant="primary"
                  onClick={() => navigate(`/tickets/${ev.id}`)}
                >
                  Citește
                </Button>
              </Card.Body>
            </Card>
          ))}
        </div>
      </section>

      <section className={styles["info-section"]}>
        <div className={styles["section-header"]}>
          <h2>Despre cultura japoneză</h2>
          <div className={styles.divider}></div>
        </div>

        <div className={styles.info}>
          <article>
            <h3>
              🎭 Kabuki <span className={styles.jap}>歌舞伎</span>
            </h3>
            <p>
              Kabuki reprezintă o formă clasică a teatrului japonez, avându-și
              originile în secolul al XVII-lea și fiind cunoscut pentru
              spectacolele excentrice și temele exagerat de dramatice abordate.
              Machiajul neobișnuit simbolizează caracteristicile și emoțiile
              personajului, limbajul corpului și expresiile faciale sunt
              dramatice, iar subiectele abordate pot fi atât istorice, cât și
              din mediul cotidian, adesea făcându-se referință la mitologia
              japoneză.
            </p>
          </article>

          <article>
            <h3>
              🎎 Bunraku <span className={styles.jap}>文楽</span>
            </h3>
            <p>
              Bunraku constituie o formă de teatru tradițional japonez cu păpuși
              ce a apărut în secolul al XVII-lea, unde fiecare marionetă este
              controlată de 3 păpușari. Temele abordate sunt variate, iar
              poveștile sunt relatate de un narator ce interpretează fiecare
              personaj.
            </p>
          </article>

          <article>
            <h3>
              👺 Noh <span className={styles.jap}>能</span>
            </h3>
            <p>
              Noh este cea mai veche formă de teatru tradițional și datează din
              secolul al XIV-lea. Subiectele tratate sunt inspirate din
              literatură, mitologie și legende, iar actorii sunt, la fel ca în
              Kabuki, exclusiv bărbați. Noh se concentrează pe simbolism și
              spiritualitate, abordând un stil minimalist, motiv pentru care
              este considerat elitist, iar spre deosebire de Kabuki, nu este la
              fel de ușor accesibil publicului general.
            </p>
          </article>
        </div>
      </section>

      <footer className={styles["footer-section"]}>
        <div className={styles["footer-content"]}>
          <p>© {new Date().getFullYear()} Cultura Japoneză</p>
          <p>
            Contact: <a href="mailto:contact@japonia.ro">contact@japonia.ro</a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
