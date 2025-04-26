import { ShieldCheckIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import "./Security.css";

const Security = () => {
  const features = [
    "End-to-end encryption",
    "Two-factor authentication",
    "Regular security audits",
    "Secure data storage",
    "Fraud protection",
    "24/7 monitoring"
  ];

  return (
    <section className="security">
      <div className="security-content">
        <motion.div
          className="security-text"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2>Your Security is Our Top Priority</h2>
          <p>
            We implement industry-leading security measures to protect your financial data and personal information. Rest easy knowing your money is safe with us.
          </p>
        </motion.div>

        <motion.div
          className="security-card"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="security-icon">
            <ShieldCheckIcon className="w-8 h-8" />
          </div>
          <div className="security-features">
            {features.map((feature, index) => (
              <motion.div
                key={feature}
                className="security-feature"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                  />
                </svg>
                <span>{feature}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Security; 