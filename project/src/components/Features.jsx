import { motion } from "framer-motion";
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import "./Features.css";

const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div
    className="feature-card"
    whileHover={{ y: -5 }}
    transition={{ duration: 0.2 }}
  >
    <div className="feature-icon">
      <Icon className="w-6 h-6" />
    </div>
    <h3>{title}</h3>
    <p>{description}</p>
  </motion.div>
);

const Features = () => {
  const features = [
    {
      icon: ChartBarIcon,
      title: "Smart Analytics",
      description: "Get detailed insights into your spending patterns and financial health.",
    },
    {
      icon: CurrencyDollarIcon,
      title: "Budget Tracking",
      description: "Set and monitor budgets with real-time updates and smart notifications.",
    },
    {
      icon: ShieldCheckIcon,
      title: "Secure Banking",
      description: "Bank-level security with end-to-end encryption for your peace of mind.",
    },
    {
      icon: UserGroupIcon,
      title: "Family Accounts",
      description: "Manage family finances with shared accounts and spending limits.",
    },
  ];

  return (
    <section className="features">
      <div className="features-content">
        <motion.div
          className="features-text"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2>Powerful Features for Your Financial Success</h2>
          <p>
            Experience the future of personal finance with our comprehensive suite of features designed to help you achieve your financial goals.
          </p>
          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <FeatureCard {...feature} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="features-image"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="features-image-container">
            <div className="features-blob features-blob-1"></div>
            <div className="features-blob features-blob-2"></div>
            <div className="features-blob features-blob-3"></div>
            <img
              src="/app-interface.svg"
              alt="Cleo App Features"
              className="features-mockup"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features; 