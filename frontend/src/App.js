import { BrowserRouter, Routes, Route } from "react-router-dom";
import Calendar from "./Pages/Calendar";
import Tickets from "./Pages/Tickets";
import Home from "./Pages/Home";
import Login from "./Pages/Login";

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
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
