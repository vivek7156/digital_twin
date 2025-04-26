import { Link } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-logo">
            ADAM
          </Link>

          {/* Mobile Menu Button */}
          <button className="mobile-menu-button" onClick={toggleMenu}>
            <span className={`hamburger ${isMenuOpen ? "open" : ""}`}></span>
            <span className={`hamburger ${isMenuOpen ? "open" : ""}`}></span>
            <span className={`hamburger ${isMenuOpen ? "open" : ""}`}></span>
          </button>

          {/* Navbar Links */}
          <div className={`navbar-links ${isMenuOpen ? "open" : ""}`}>
            <Link to="/features">Features</Link>
            <Link to="/pricing">Pricing</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/dashboard">Dashboard</Link> {/* New Dashboard Link */}
          </div>

          {/* Auth Buttons */}
          <div className={`navbar-auth ${isMenuOpen ? "open" : ""}`}>
            <Link to="/login" className="auth-link">
              Log in
            </Link>
            <Link to="/signup" className="auth-button">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
