// Header.js
import React from "react";
import { Link } from "react-router-dom";

function Header({ toggleSidebar, isSidebarOpen }) {
  return (
    <div>
      {/* Sidebar */}
      <div
        className={`offcanvas offcanvas-start ${isSidebarOpen ? "show" : ""}`}
        tabIndex="-1"
        id="offcanvasNavbar"
        aria-labelledby="offcanvasNavbarLabel"
        style={{ width: "250px", position: "fixed", zIndex: "1040" }}
      >
        <div class="list-group" style={{ marginTop: '60px' }} >
          <ul class="list-group">
            <li class="list-group-item"><a href="/">Home</a></li>
            <li class="list-group-item">A second item</li>
            <li class="list-group-item">A third item</li>
            <li class="list-group-item">A fourth item</li>
            <li class="list-group-item">And a fifth one</li>
          </ul>
        </div>
        </div>

        {/* Page Content */}
        <div style={{ marginLeft: isSidebarOpen ? "250px" : "0", transition: "margin-left 0.3s", marginTop: "60px", zIndex: "1030" }}>
          {/* Header */}
          <nav className="navbar bg-body-tertiary fixed-top" style={{ zIndex: "1050" }}>

            <div className="container-fluid">
              <a className="navbar-brand" href="#">
                Diyana Fashion Store
              </a>
              <button
                className="navbar-toggler"
                type="button"
                onClick={toggleSidebar}
              >
                <span className="navbar-toggler-icon"></span>
              </button>
            </div>
          </nav>
        </div>
      </div>
      );
}

      export default Header;
