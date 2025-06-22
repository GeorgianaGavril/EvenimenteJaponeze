import AdminAddEventForm from "../Components/Form";
import Navbar from "../Components/Navbar";
import axios from "axios";

export default function AddEvent() {
  const handleAddEvent = async (data) => {
    try {
      await axios.post("http://localhost:3004/api/event/", data);
      alert("Eveniment adăugat cu succes!");
    } catch (err) {
      alert("Eroare la adăugare: " + err.message);
    }
  };

  return (
    <>
      <Navbar />
      <AdminAddEventForm onSubmit={handleAddEvent} />
    </>
  );
}
