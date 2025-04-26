import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h1>Cleo</h1>
            <p>Making finance smarter for everyone.</p>
          </div>
          <div className="footer-links">
            <h5>Product</h5>
            <ul>
              <li><a href="#features">Features</a></li>
              <li><a href="#security">Security</a></li>
              <li><a href="#pricing">Pricing</a></li>
            </ul>
          </div>
          <div className="footer-links">
            <h5>Company</h5>
            <ul>
              <li><a href="#about">About</a></li>
              <li><a href="#careers">Careers</a></li>
              <li><a href="#press">Press</a></li>
            </ul>
          </div>
          <div className="footer-links">
            <h5>Legal</h5>
            <ul>
              <li><a href="#privacy">Privacy</a></li>
              <li><a href="#terms">Terms</a></li>
              <li><a href="#security">Security</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 