import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Navbar from "../Components/Navbar";
import "../css/pages/home.css";
import sakuraImg from "../assets/images/Sakura branch cream.png";
import cardImg1 from "../assets/images/213.jpg";
import cardImg2 from "../assets/images/43078.jpg";
import cardImg3 from "../assets/images/7032.jpg";

function Home() {
  return (
    <div>
      <Navbar />
      <section className="intro-section">
        <div className="welcome">
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
          <Button variant="primary">Vezi evenimentele</Button>
        </div>

        <div className="col-md-6 text-center sakura-pic">
          <img
            src={sakuraImg}
            alt="Sakura"
            className="img-fluid rounded"
            width={600}
            style={{ maxWidth: "100%" }}
          />
        </div>
      </section>

      <section className="showcase-section">
        <div className="section-header">
          <h2>Spectacole</h2>
          <div className="divider"></div>
        </div>

        <div className="card-container">
          <Card className="show-cards">
            <Card.Img variant="top" src={cardImg1} />
            <Card.Body>
              <Card.Title>Koto</Card.Title>
              <Card.Text>
                Some quick example text to build on the card title and make up
                the bulk of the card's content.
              </Card.Text>
              <br></br>
              <Button variant="primary">Citește</Button>
            </Card.Body>
          </Card>

          <Card className="show-cards card2">
            <Card.Img variant="top" src={cardImg2} />
            <Card.Body>
              <Card.Title>Kabuki</Card.Title>
              <Card.Text>
                Some quick example text to build on the card title and make up
                the bulk of the card's content.
              </Card.Text>
              <br></br>
              <Button variant="primary">Citește</Button>
            </Card.Body>
          </Card>

          <Card className="show-cards">
            <Card.Img variant="top" src={cardImg3} />
            <Card.Body>
              <Card.Title>Noh</Card.Title>
              <Card.Text>
                Some quick example text to build on the card title and make up
                the bulk of the card's content.
              </Card.Text>
              <br></br>
              <Button variant="primary">Citește</Button>
            </Card.Body>
          </Card>
        </div>
      </section>

      <section className="info-section">
        <div className="section-header">
          <h2>Despre cultura japoneză</h2>
          <div className="divider"></div>
        </div>

        <div className="info">
          <article>
            <h3>
              🎭 Kabuki <span className="jap">歌舞伎</span>
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
              🎎 Bunraku <span className="jap">文楽</span>
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
              👺 Noh <span className="jap">能</span>
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

      <footer className="footer-section">
        <div className="footer-content">
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
