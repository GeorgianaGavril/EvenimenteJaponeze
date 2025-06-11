import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar";
import styles from "../css/pages/calendar.module.css";
import "../css/pages/calendar-global.css";
import DatePicker from "react-datepicker";
import { addMonths, subMonths, format } from "date-fns";
import { ro } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import Button from "react-bootstrap/Button";
import axios from "axios";

function Calendar() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [dates, setDates] = useState([]);
  const [eventsMap, setEventsMap] = useState(new Map());

  useEffect(() => {
    getAllEvents();
  }, []);

  async function getAllEvents() {
    try {
      const res = await axios.get("http://localhost:3004/api/event/");

      const map = new Map();
      const events = res.data.map((ev) => {
        const key = ev.data.slice(0, 10);
        map.set(key, ev);
        return key;
      });

      setEventsMap(map);
      setSelectedDate(events[0]);
      setDates(events);
    } catch (err) {
      console.error(err);
    }
  }

  const handleDataChange = (date) => {
    const key = date.toISOString().slice(0, 10);
    setSelectedDate(key);
  };

  return (
    <div className={styles["pageWrapper"]}>
      <Navbar />
      <h1 className={styles.title}>Calendar de spectacole</h1>
      <div className={styles.divider}></div>
      <div className={styles.dateEvent}>
        <div className={styles.calendarWrapper}>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => handleDataChange(date)}
            inline
            locale={ro}
            dateFormat="dd.MM.yyyy"
            className="custom-input"
            calendarClassName="calendar"
            dayClassName={(date) =>
              dates.some((d) => {
                const data = new Date(d);
                return (
                  data.getDate() === date.getDate() &&
                  data.getMonth() === date.getMonth() &&
                  data.getFullYear() === date.getFullYear()
                );
              })
                ? "event-day"
                : "non-event-day"
            }
            renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => (
              <div className={styles.customCalendarHeader}>
                <button onClick={decreaseMonth} className={styles.navBtn}>
                  « {format(subMonths(date, 1), "MMM", { locale: ro })}
                </button>
                <span className="month-title">
                  {format(date, "MMMM", { locale: ro })}
                </span>
                <button onClick={increaseMonth} className={styles.navBtn}>
                  {format(addMonths(date, 1), "MMM", { locale: ro })} »
                </button>
              </div>
            )}
          />
        </div>

        <div className={styles.eventCard}>
          <h2>{eventsMap.get(selectedDate)?.titlu}</h2>
          <p>{eventsMap.get(selectedDate)?.descriere}</p>
          <div>
            <h6>
              <strong>Data:</strong> {format(selectedDate, "dd.MM.yyyy")}
            </h6>
            <h6>
              <strong>Ora:</strong>{" "}
              {eventsMap.get(selectedDate)?.data.slice(11, 16)}
            </h6>
            <h6>
              <strong>Durată:</strong> {eventsMap.get(selectedDate)?.durata}{" "}
              minute
            </h6>
          </div>
          <Link to={`/tickets/${eventsMap.get(selectedDate)?.id}`}>
            <Button>Cumpără bilete</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Calendar;
