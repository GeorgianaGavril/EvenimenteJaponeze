import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function AddArtistForm({ onArtistAdded }) {
  const [nume, setNume] = useState("");
  const [prenume, setPrenume] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nume.trim() || !prenume.trim()) return;

    try {
      await axios.post("http://localhost:3004/api/artist", { nume, prenume });
      toast.success("Artist adăugat cu succes!");
      setNume("");
      setPrenume("");
      onArtistAdded();
    } catch (err) {
      toast.error("Eroare la adăugarea artistului.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "2rem" }}>
      <h3>Adaugă Artist</h3>
      <input
        type="text"
        placeholder="Nume"
        value={nume}
        onChange={(e) => setNume(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Prenume"
        value={prenume}
        onChange={(e) => setPrenume(e.target.value)}
        required
      />
      <button type="submit">Adaugă</button>
    </form>
  );
}

export default AddArtistForm;
