import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  const navigate = useNavigate();
  // TODO: Replace with actual auth check from your auth system
  const isAuthenticated = false; // This should come from your auth context/state

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <section className="hero">
      <div className="hero-grid-bg"></div>
      <div className="hero-content">
        <motion.div 
          className="hero-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>Smart Money Management Made Simple</h1>
          <p>
            Take control of your finances with Cleo. Track expenses, set budgets, and achieve your financial goals with our intuitive platform.
          </p>
          <div className="hero-buttons">
            <motion.button
              className="primary-button"
              onClick={handleGetStarted}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
            <motion.button
              className="secondary-button"
              onClick={() => navigate('/about')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </motion.button>
          </div>
        </motion.div>

        <motion.div 
          className="hero-image-container"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="blob-container">
            <div className="blob blob-1"></div>
            <div className="blob blob-2"></div>
            <div className="blob blob-3"></div>
          </div>
          <img 
            src="/app-interface.svg" 
            alt="Cleo App Interface" 
            className="phone-mockup"
          />
        </motion.div>
      </div>
    </section>
  );
}

export default Hero; 