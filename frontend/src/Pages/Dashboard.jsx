import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../css/pages/dashboard.module.css";
import { Pencil, Trash2, Plus } from "lucide-react";
import Navbar from "../Components/Navbar";
import { toast, ToastContainer } from "react-toastify";
import SeatMap from "../Components/SeatMap";
import AddArtistForm from "../Components/ArtistForm";

export default function Dashboard() {
  const [evenimente, setEvenimente] = useState([]);
  const [filtru, setFiltru] = useState("");
  const [sort, setSort] = useState("desc");
  const [sali, setSali] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvenimente();
    fetchSali();
  }, []);

  const fetchEvenimente = async () => {
    try {
      const res = await axios.get("http://localhost:3004/api/event");
      setEvenimente(res.data);
    } catch (err) {
      console.error("Eroare la preluarea evenimentelor", err);
    }
  };

  const fetchSali = async () => {
    try {
      const res = await axios.get("http://localhost:3004/api/sala");
      setSali(res.data);
    } catch (err) {
      toast.error("Eroare la preluarea sălilor.");
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/modifyEvent/${id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Ești sigur că vrei să ștergi acest eveniment?"))
      return;
    try {
      await axios.delete(`http://localhost:3004/api/event/${id}`, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      });
      fetchEvenimente();
      toast.success("Eveniment eliminat!");
    } catch (err) {
      console.error("Eroare la ștergere", err);
    }
  };

  async function creareLocuri() {
    const svg = document.getElementById("Sala1");
    const groups = Array.from(svg.querySelectorAll("g[id]")).slice(1);

    const locuri = [];

    groups.forEach((g) => {
      let categorie;
      if (g.id.split("_")[0][0] === "L") {
        categorie = "Loja";
      } else if (Number(g.id.split("_")[0].slice(1)) > 5) {
        categorie = "Standard";
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

  const evenimenteFiltrate = evenimente
    .filter((ev) => ev.titlu.toLowerCase().includes(filtru.toLowerCase()))
    .sort((a, b) => {
      const dateA = new Date(a.data);
      const dateB = new Date(b.data);
      return sort === "asc" ? dateA - dateB : dateB - dateA;
    });

  return (
    <>
      <Navbar />
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h2>Evenimente</h2>
          <div className={styles.actionsHeader}>
            <input
              type="text"
              placeholder="Caută după titlu..."
              value={filtru}
              onChange={(e) => setFiltru(e.target.value)}
              className={styles.searchInput}
            />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className={styles.sortSelect}
            >
              <option value="desc">Cele mai noi</option>
              <option value="asc">Cele mai vechi</option>
            </select>
            <button
              className={styles.addBtn}
              onClick={() => navigate("/admin/addEvent")}
            >
              {" "}
              <Plus size={18} /> Adaugă Eveniment{" "}
            </button>
          </div>
        </div>

        <div className={styles.cardGrid}>
          {evenimenteFiltrate.length === 0 ? (
            <p>Nu există evenimente care să corespundă filtrului.</p>
          ) : (
            evenimenteFiltrate.map((ev) => (
              <div className={styles.card} key={ev.id}>
                <h3>{ev.titlu}</h3>
                <p>
                  <strong>Data:</strong> {new Date(ev.data).toLocaleString()}
                </p>
                <p>
                  <strong>Durată:</strong> {ev.durata} min
                </p>
                <div className={styles.actions}>
                  <button
                    onClick={() => handleEdit(ev.id)}
                    className={styles.edit}
                  >
                    <Pencil size={16} /> Modifică
                  </button>
                  <button
                    onClick={() => handleDelete(ev.id)}
                    className={styles.delete}
                  >
                    <Trash2 size={16} /> Șterge
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className={styles.separator}></div>

        <AddArtistForm onArtistAdded={fetchEvenimente} />

        <div className={styles.separator}></div>
        <div className={styles.header}>
          <h2>Gestionare Săli</h2>
        </div>

        <div className={styles.saliGrid}>
          {sali.map((sala) => (
            <div className={styles.card} key={sala.id}>
              <h3>Sala #{sala.id}</h3>
              <p>
                <strong>Capacitate:</strong> {sala.capacitate} locuri
              </p>
              <SeatMap />
              <button
                onClick={() => creareLocuri()}
                className={styles.generateBtn}
              >
                Generează Locuri
              </button>
            </div>
          ))}
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
