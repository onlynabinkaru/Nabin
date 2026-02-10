import React, { useState } from "react";
import { motion } from "framer-motion";

interface NameInputProps {
  onSubmit: (name: string) => void;
}

const NameInput: React.FC<NameInputProps> = ({ onSubmit }) => {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <div
      className="bg-white rounded-3xl shadow-2xl p-8 text-center space-y-6 border-4 border-rose-100"
      role="form"
      aria-labelledby="form-title"
    >
      <div className="text-5xl mb-4" aria-hidden="true">
        🌹
      </div>
      <h2
        id="form-title"
        className="text-3xl font-bold text-gray-800 font-serif-elegant"
      >
        Wait!
      </h2>
      <div className="space-y-1">
        <p className="text-gray-500 font-medium">
          Who should I give this rose to?
        </p>
        <p className="text-rose-400 text-xs italic font-medium">
          Hint: This rose is only for someone special and her name starts with
          1st letter k❤️
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name..."
          aria-label="Recipient's name"
          className="w-full px-6 py-4 text-lg border-2 border-rose-100 rounded-2xl focus:outline-none focus:border-rose-400 transition-colors text-center font-medium placeholder-gray-300"
          autoFocus
          required
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          aria-label="Give rose to the recipient"
          className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-rose-200 transition-all text-lg outline-none focus-visible:ring-4 focus-visible:ring-rose-300"
        >
          Give Rose 🌹
        </motion.button>
      </form>
    </div>
  );
};

export default NameInput;
