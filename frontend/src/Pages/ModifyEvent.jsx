import { useEffect, useState } from "react";
import Form from "../Components/Form";
import Navbar from "../Components/Navbar";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function ModifyEvent() {
  const { id } = useParams();
  const [event, setEvent] = useState();

  useEffect(() => {
    fetchEvenimente();
  }, []);

  const fetchEvenimente = async () => {
    try {
      const res = await axios.get(`http://localhost:3004/api/event/${id}`);
      setEvent(res.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleModifyEvent = async (data) => {
    try {
      await axios.patch(`http://localhost:3004/api/event/${id}`, data, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      });
      console.log("Eveniment modificat cu succes!");
    } catch (err) {
      alert("Eroare la modificare: " + err.message);
    }
  };

  return (
    <>
      <Navbar />
      <Form
        onSubmit={handleModifyEvent}
        initialValues={event}
        titluFormular="Modifică Eveniment"
        isEdit={true}
      />
    </>
  );
}
