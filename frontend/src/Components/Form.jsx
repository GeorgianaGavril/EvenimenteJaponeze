import { useEffect, useState } from "react";
import styles from "../css/components/form.module.css";
import axios from "axios";
import {
  FileText,
  CalendarClock,
  Clock,
  StickyNote,
  BadgeDollarSign,
  Ticket,
  Tag,
  Building2,
  Users,
} from "lucide-react";

const AdminAddEventForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    titlu: "",
    data: "",
    durata: "",
    descriere: "",
    pretVIP: "",
    pretLoja: "",
    pretStandard: "",
    idSala: "",
    artisti: [],
  });

  const [sali, setSali] = useState([]);
  const [artisti, setArtisti] = useState([]);

  useEffect(() => {
    getAllSali();
    getAllArtisti();
  }, []);

  async function getAllSali() {
    try {
      const res = await axios.get(`http://localhost:3004/api/sala/`);
      setSali(res.data);
    } catch (err) {
      console.error("Eroare la returnarea artistilor: ", err);
    }
  }

  async function getAllArtisti() {
    try {
      const res = await axios.get(`http://localhost:3004/api/artist/`);
      setArtisti(res.data);
    } catch (err) {
      console.error("Eroare la returnarea artistilor: ", err);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArtistiChange = (e) => {
    const selected = Array.from(e.target.selectedOptions).map(
      (opt) => opt.value
    );
    setFormData((prev) => ({ ...prev, artisti: selected }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={styles["event-form"]}>
      <h2 className={styles["form-title"]}>Adaugă Eveniment</h2>

      <div className={styles["form-group"]}>
        <label htmlFor="titlu">Titlu</label>
        <div className={styles["input-wrapper"]}>
          <FileText className={styles.icon} />
          <input
            type="text"
            id="titlu"
            name="titlu"
            value={formData.titlu}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className={styles["form-group"]}>
        <label htmlFor="data">Data</label>
        <div className={styles["input-wrapper"]}>
          <CalendarClock className={styles.icon} />
          <input
            type="datetime-local"
            name="data"
            id="data"
            value={formData.data}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className={styles["form-group"]}>
        <label htmlFor="durata">Durată (minute)</label>
        <div className={styles["input-wrapper"]}>
          <Clock className={styles.icon} />
          <input
            type="number"
            id="durata"
            name="durata"
            value={formData.durata}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className={styles["form-group"]}>
        <label htmlFor="descriere">Descriere</label>
        <div className={styles["input-wrapper"]}>
          <StickyNote className={styles.icon} />
          <textarea
            id="descriere"
            name="descriere"
            rows="3"
            value={formData.descriere}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className={styles["form-group"]}>
        <label htmlFor="pretVIP">Preț VIP</label>
        <div className={styles["input-wrapper"]}>
          <BadgeDollarSign className={styles.icon} />
          <input
            type="number"
            id="pretVIP"
            name="pretVIP"
            value={formData.pretVIP}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className={styles["form-group"]}>
        <label htmlFor="pretLoja">Preț Loja</label>
        <div className={styles["input-wrapper"]}>
          <Ticket className={styles.icon} />
          <input
            type="number"
            id="pretLoja"
            name="pretLoja"
            value={formData.pretLoja}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className={styles["form-group"]}>
        <label htmlFor="pretStandard">Preț Standard</label>
        <div className={styles["input-wrapper"]}>
          <Tag className={styles.icon} />
          <input
            type="number"
            id="pretStandard"
            name="pretStandard"
            value={formData.pretStandard}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className={styles["form-group"]}>
        <label htmlFor="idSala">Sală</label>
        <div className={styles["input-wrapper"]}>
          <Building2 className={styles.icon} />
          <select
            name="idSala"
            value={formData.idSala}
            onChange={handleChange}
            required
          >
            <option value="">Selectează o sală</option>
            {sali.map((sala) => (
              <option key={sala.id} value={sala.id}>
                Sala #{sala.id} (Capacitate: {sala.capacitate})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles["form-group"]}>
        <label htmlFor="artisti">Artiști</label>
        <div className={styles["input-wrapper"]}>
          <Users className={styles.icon} />
          <select
            name="artisti"
            multiple
            value={formData.artisti}
            onChange={handleArtistiChange}
          >
            {artisti.map((artist) => (
              <option key={artist.id} value={artist.id}>
                {artist.nume} {artist.prenume}
              </option>
            ))}
          </select>
        </div>
        <small>Ține Ctrl (Windows) / Cmd (Mac) pentru selecție multiplă</small>
      </div>

      <button type="submit" className={styles["submit-btn"]}>
        Salvează Eveniment
      </button>
    </form>
  );
};

export default AdminAddEventForm;
