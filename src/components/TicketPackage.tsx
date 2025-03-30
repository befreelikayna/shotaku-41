
import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface TicketPackageProps {
  name: string;
  price: number;
  description: string;
  features: string[];
  isPopular?: boolean;
}

const TicketPackage: React.FC<TicketPackageProps> = ({
  name,
  price,
  description,
  features,
  isPopular = false,
}) => {
  return (
    <motion.div
      className={`rounded-2xl overflow-hidden border ${
        isPopular 
          ? "border-festival-accent bg-white shadow-accent" 
          : "border-slate-100 bg-white shadow-soft"
      }`}
      whileHover={{ y: -5, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      {isPopular && (
        <div className="bg-festival-accent text-white text-center py-2 text-sm font-medium">
          Recommandé
        </div>
      )}
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-festival-primary mb-2">{name}</h3>
        <div className="flex items-baseline mb-4">
          <span className="text-3xl font-bold text-festival-primary">{price}</span>
          <span className="text-festival-secondary ml-1">MAD</span>
        </div>
        <p className="text-festival-secondary mb-6">{description}</p>
        
        <ul className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                <Check className="h-3 w-3 text-green-600" />
              </span>
              <span className="text-sm text-festival-secondary">{feature}</span>
            </li>
          ))}
        </ul>
        
        <a
          href="#buy"
          className={`w-full block text-center py-3 rounded-full transition-all duration-300 ${
            isPopular 
              ? "bg-festival-accent text-white hover:bg-opacity-90" 
              : "bg-white border border-slate-200 text-festival-primary hover:bg-slate-50"
          }`}
        >
          Acheter
        </a>
      </div>
    </motion.div>
  );
};

export default TicketPackage;
