import React from "react";
import "../css/components/navbar.css";
import sakuraStage from "../assets/images/Sakura Stage (1).png";

function Navbar() {
  return (
    <div className="navbar">
      <div>
        <img src={sakuraStage} width={150} alt="Logo" />
      </div>
      <div className="pages">
        <button>Acasă</button>
        <button>Calendar</button>
        <button>Evenimente</button>
        <button>Despre noi</button>
        <button>Contact</button>
      </div>
    </div>
  );
}

export default Navbar;
