import Form from "../Components/Form";
import Navbar from "../Components/Navbar";
import axios from "axios";

export default function AddEvent() {
  const handleAddEvent = async (data) => {
    try {
      await axios.post("http://localhost:3004/api/event/", data, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      });
      console.log("Eveniment adaugat cu succes!");
    } catch (err) {
      alert("Eroare la adăugare: " + err.message);
    }
  };

  return (
    <>
      <Navbar />
      <Form onSubmit={handleAddEvent} />
    </>
  );
}
