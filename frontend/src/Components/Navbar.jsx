import React from "react";
import "../css/components/navbar.css";

function Navbar() {
  return (
    <div className="navbar">
      <button>Acasă</button>
      <button>Calendar</button>
      <button>Evenimente</button>
      <button>Despre noi</button>
      <button>Contact</button>
    </div>
  );
}

export default Navbar;
