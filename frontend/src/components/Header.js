// Header.js
import React from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from '../hooks/useAuthContext' // Import useAuthContext hook

const Header = ({ isSidebarOpen, toggleSidebar }) => {
  const { user, logout } = useAuthContext(); // Destructure user and logout from useAuthContext

  // Define handleClick function
  const handleClick = () => {
    logout();
  }

  return (
    <header>
      <div>
        <nav>
          {/* Page Content */}
          <div style={{ marginLeft: isSidebarOpen ? "250px" : "0", transition: "margin-left 0.3s", marginTop: "60px", zIndex: "1030" }}>
            {/* Header */}
            <nav className="navbar bg-body-tertiary fixed-top" style={{ zIndex: "1050" }}>

              <div className="container-fluid">
                <a className="navbar-brand" href="#">
                  Diyana Fashion 
                </a>
                {user ? ( // Use conditional rendering to show either logout button or login/signup links
                  <div>
                    <span>{user.email}</span>
                    <button type="button" className="btn btn-primary" onClick={handleClick}>Log out</button>
                  </div>
                ) : (
                  <div>
                    <a class="btn btn-primary" href="/login" role="button">Login</a>&nbsp;&nbsp;&nbsp;&nbsp;
                    <a class="btn btn-primary" href="/signup" role="button">Sign Up</a>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
