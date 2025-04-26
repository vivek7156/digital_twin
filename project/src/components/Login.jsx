import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <motion.div 
          className="auth-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="auth-header">
            <h2>Welcome back</h2>
            <p>Enter your details to access your account</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <a href="#forgot-password" className="forgot-password">
                Forgot password?
              </a>
            </div>

            <button type="submit" className="auth-button">
              Sign In
            </button>

            <div className="auth-divider">
              <span>Or continue with</span>
            </div>

            <div className="social-buttons">
              <button type="button" className="social-button google">
                <img src="/google.svg" alt="Google" />
                Google
              </button>
              <button type="button" className="social-button github">
                <img src="/github.svg" alt="GitHub" />
                GitHub
              </button>
            </div>
          </form>

          <p className="auth-footer">
            Don't have an account?{' '}
            <Link to="/signup" className="auth-link">
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default Login; 