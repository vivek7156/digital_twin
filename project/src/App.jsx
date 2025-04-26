import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar  from "./components/Navbar";
// import Dashboard  from "./components/Dashboard";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Security from "./components/Security";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./pages/Dashboard"; // Import Dashboard Page
import FetchOnClick from "./pages/api"; 
import ModernChatbotInterface from "./pages/ModernChatbotInterface";

function App() {
  return (
    <Router>
      <Routes>
        {/* Login and Signup Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Dashboard Page */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/123" element={<ModernChatbotInterface />} />
        <Route path="/1234" element={<FetchOnClick />} />

        {/* Home Page */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Hero />
              <Features />
              <Security />
              <Footer />
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
