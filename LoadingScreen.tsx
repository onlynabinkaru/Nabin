import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LOADING_MESSAGES = [
  "Planting digital seeds...",
  "Watering the stem...",
  "Arranging the petals...",
  "Infusing with love...",
  "Almost ready to bloom...",
];

const LoadingScreen: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Faster message cycling
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 500);

    // Faster progress bar (Reaches 100 in ~2.5s)
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 2;
      });
    }, 50);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-10 py-10">
      <div className="relative w-64 h-80 flex items-center justify-center">
        <svg viewBox="0 0 100 150" className="w-full h-full drop-shadow-2xl">
          {/* Stem - Growing upwards */}
          <motion.path
            d="M50 140 C 50 120, 45 100, 50 60"
            fill="transparent"
            strokeWidth="3"
            stroke="#166534"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />

          {/* Leaf 1 - Left */}
          <motion.path
            d="M50 110 C 30 110, 20 95, 35 90 C 45 88, 50 100, 50 110"
            fill="#15803d"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8, type: "spring" }}
            className="origin-bottom-right"
          />

          {/* Leaf 2 - Right */}
          <motion.path
            d="M50 90 C 70 90, 80 75, 65 70 C 55 68, 50 80, 50 90"
            fill="#15803d"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8, type: "spring" }}
            className="origin-bottom-left"
          />

          {/* Rose Bud Bloom Animation */}
          <motion.g
            initial={{ scale: 0, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            transition={{
              delay: 1.2,
              duration: 1,
              type: "spring",
              stiffness: 60,
            }}
          >
            {/* Outer Petals */}
            <circle cx="50" cy="55" r="18" fill="#be123c" />
            <circle cx="40" cy="48" r="15" fill="#e11d48" />
            <circle cx="60" cy="48" r="15" fill="#fb7185" opacity="0.8" />
            <circle cx="50" cy="40" r="12" fill="#f43f5e" />

            {/* Center detail */}
            <motion.path
              d="M44 45 Q 50 35 56 45"
              stroke="#881337"
              strokeWidth="2"
              fill="transparent"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 1.8, duration: 0.5 }}
            />
          </motion.g>
        </svg>

        {/* Heart Glow effect */}
        <motion.div
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 w-32 h-32 bg-rose-400 rounded-full filter blur-3xl -z-10"
        />
      </div>

      <div className="w-full max-w-[280px] space-y-4">
        <div className="flex justify-between items-end mb-1">
          <div className="h-6 overflow-hidden relative w-full">
            <AnimatePresence mode="wait">
              <motion.p
                key={messageIndex}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-rose-500 font-bold text-xs uppercase tracking-widest text-left"
              >
                {LOADING_MESSAGES[messageIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
          <span className="text-rose-400 font-mono text-sm font-bold ml-2">
            {progress}%
          </span>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full h-2 bg-rose-100 rounded-full overflow-hidden relative shadow-inner">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "tween", ease: "linear" }}
            className="h-full bg-gradient-to-r from-rose-400 to-rose-600 rounded-full relative"
          >
            {/* Shimmer effect on the bar */}
            <motion.div
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 w-1/2 bg-white/30 skew-x-12"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;

export const CompactLoading: React.FC<{ label?: string }> = ({ label }) => {
  return (
    <div className="flex items-center justify-center space-x-4 py-6">
      <motion.div
        animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.08, 0.98, 1] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-rose-600 text-white text-2xl shadow-lg"
        aria-hidden="true"
      >
        🌹
      </motion.div>

      <div className="flex flex-col items-start">
        <motion.span
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: [0.6, 1, 0.6], y: [6, 0, 6] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          className="text-rose-600 font-bold text-sm"
        >
          {label || "Creating the perfect note..."}
        </motion.span>
        <div className="flex items-center mt-1">
          <div className="w-20 h-1 bg-rose-100 rounded-full overflow-hidden">
            <motion.div
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
              className="h-full bg-gradient-to-r from-rose-400 to-rose-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
