import { BrowserRouter, Routes, Route } from "react-router-dom";
import Calendar from "./Pages/Calendar";
import Tickets from "./Pages/Tickets";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Statistics from "./Pages/Statistics";
import AddEvent from "./Pages/AddEvent";
import Dashboard from "./Pages/Dashboard";
import ModifyEvent from "./Pages/ModifyEvent";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/tickets/:id" element={<Tickets />} />
          <Route path="/login" element={<Login />} />
          <Route path="/account" element={<Login />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/addEvent" element={<AddEvent />} />
          <Route path="/admin/modifyEvent/:id" element={<ModifyEvent />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
