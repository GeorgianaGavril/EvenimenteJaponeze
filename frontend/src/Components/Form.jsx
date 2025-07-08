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
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";

const Form = ({
  onSubmit,
  initialValues = {},
  titluFormular = "Adaugă Eveniment",
  isEdit = false,
}) => {
  const [formData, setFormData] = useState({
    titlu: initialValues.titlu || "",
    data: initialValues?.data || "",
    durata: initialValues?.durata || "",
    descriere: initialValues?.descriere || "",
    pretVIP: initialValues?.pretVIP || "",
    pretLoja: initialValues?.pretLoja || "",
    pretStandard: initialValues?.pretStandard || "",
    salaId: initialValues?.salaId || "",
    artisti: initialValues?.artisti || [],
  });

  const [sali, setSali] = useState([]);
  const [artisti, setArtisti] = useState([]);
  const [formInitialized, setFormInitialized] = useState(false);

  useEffect(() => {
    getAllSali();
    getAllArtisti();
  }, []);

  useEffect(() => {
    if (initialValues && !formInitialized) {
      const dataInitiala = initialValues.data;

      const dataFormatata =
        dataInitiala && !isNaN(new Date(dataInitiala))
          ? new Date(dataInitiala).toISOString().slice(0, 16)
          : "";

      setFormData({
        titlu: initialValues.titlu || "",
        data: dataFormatata || "",
        durata: initialValues.durata || "",
        descriere: initialValues.descriere || "",
        pretVIP: initialValues.pretVIP || "",
        pretLoja: initialValues.pretLoja || "",
        pretStandard: initialValues.pretStandard || "",
        salaId: initialValues.salaId || "",
        artisti: initialValues.artisti || [],
      });

      setFormInitialized(true);
    }
  }, [initialValues, formInitialized]);

  async function getAllSali() {
    try {
      const res = await axios.get(`http://localhost:3004/api/sala/`);
      setSali(res.data);
    } catch (err) {
      console.error("Eroare la returnarea salilor: ", err);
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

  const addArtist = () => {
    setFormData((prev) => ({
      ...prev,
      artisti: [...prev.artisti, { idArtist: "", rol: "" }],
    }));
  };

  const removeArtist = (index) => {
    setFormData((prev) => ({
      ...prev,
      artisti: prev.artisti.filter((_, i) => i !== index),
    }));
  };

  const handleArtistChange = (index, field, value) => {
    const updated = [...formData.artisti];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, artisti: updated }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = [];

    if (
      !formData.titlu.trim() ||
      formData.titlu.length < 2 ||
      formData.titlu.length > 50
    ) {
      errors.push("Titlul trebuie să aibă între 2 și 50 de caractere.");
    }

    if (formData.descriere && formData.descriere.length > 8000) {
      errors.push("Descrierea este prea lungă (maxim 8000 caractere).");
    }

    if (formData.durata && (isNaN(formData.durata) || formData.durata < 0)) {
      errors.push("Durata trebuie să fie un număr pozitiv.");
    }

    if (
      (formData.pretVIP && (isNaN(formData.pretVIP) || formData.pretVIP < 0)) ||
      (formData.pretLoja &&
        (isNaN(formData.pretLoja) || formData.pretLoja < 0)) ||
      (formData.pretStandard &&
        (isNaN(formData.pretStandard) || formData.pretStandard < 0))
    ) {
      errors.push("Toate prețurile trebuie să fie numere pozitive.");
    }

    if (!formData.data) {
      errors.push("Data este obligatorie.");
    }

    if (!formData.salaId) {
      errors.push("Trebuie selectată o sală.");
    }

    if (errors.length > 0) {
      errors.forEach((err) => toast.error(err));
      return;
    }

    const artistiFormatati = formData.artisti
      .filter((a) => a.idArtist && a.rol)
      .map((a) => ({ id: parseInt(a.idArtist), rol: a.rol }));

    const payload = {
      ...formData,
      artisti: artistiFormatati,
    };

    setFormData({
      titlu: "",
      data: "",
      durata: "",
      descriere: "",
      pretVIP: "",
      pretLoja: "",
      pretStandard: "",
      salaId: "",
      artisti: [],
    });
    toast.success(isEdit ? "Modificare în curs..." : "Adăugare în curs...");
    onSubmit(payload);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={styles["event-form"]}>
        <h2 className={styles["form-title"]}>{titluFormular}</h2>

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
          <label htmlFor="salaId">Sală</label>
          <div className={styles["input-wrapper"]}>
            <Building2 className={styles.icon} />
            <select
              name="salaId"
              value={formData.salaId}
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
          <label>Artiști și roluri</label>
          {formData.artisti.map((item, index) => (
            <div key={index} className={styles["artist-row"]}>
              <select
                value={item.idArtist}
                onChange={(e) =>
                  handleArtistChange(index, "idArtist", e.target.value)
                }
              >
                <option value="">Selectează artist</option>
                {artisti.map((artist) => (
                  <option key={artist.id} value={artist.id}>
                    {artist.nume} {artist.prenume}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Rol"
                value={item.rol}
                onChange={(e) =>
                  handleArtistChange(index, "rol", e.target.value)
                }
              />

              <button
                type="button"
                onClick={() => removeArtist(index)}
                className={styles["remove-artist"]}
              >
                ✕
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addArtist}
            className={styles["add-artist"]}
          >
            + Adaugă artist
          </button>
        </div>

        <button type="submit" className={styles["submit-btn"]}>
          {isEdit ? "Salvează Modificările" : "Salvează Eveniment"}
        </button>
      </form>
      <ToastContainer />
    </>
  );
};

export default Form;
