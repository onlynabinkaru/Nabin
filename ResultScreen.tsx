import React, { useEffect, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { playRustle, playTypeClick } from "../utils/audio";
import { CompactLoading } from "./LoadingScreen";

interface ResultScreenProps {
  name: string;
  note: string;
  isGenerating: boolean;
  onReset: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  emoji: string;
  type: string;
}

const EFFECT_VARIATIONS = [
  { emoji: "❤️", type: "float-up" },
  { emoji: "✨", type: "sparkle" },
  { emoji: "🌸", type: "petal" },
  { emoji: "💖", type: "zoom" },
  { emoji: "💋", type: "spin" },
  { emoji: "💝", type: "drift" },
  { emoji: "💕", type: "float-up" },
  { emoji: "🎈", type: "petal" },
  { emoji: "🕊️", type: "fly" },
  { emoji: "🌈", type: "arc" },
];

const PETAL_TYPES = ["🌸", "🌹", "🌷", "🌺", "🍃", "✨", "💖"];

const ResultScreen: React.FC<ResultScreenProps> = ({
  name,
  note,
  isGenerating,
  onReset,
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [clickCounts, setClickCounts] = useState<Record<number, number>>({});
  const [isBloomed, setIsBloomed] = useState(false);

  useEffect(() => {
    if (!isGenerating && note) {
      playRustle();
    }
  }, [isGenerating, note]);

  const words = useMemo(() => (note ? note.split(" ") : []), [note]);

  // Handle subtle typing sounds - sped up for better experience
  useEffect(() => {
    if (!isGenerating && words.length > 0) {
      const timers: number[] = [];
      words.forEach((_, i) => {
        const delay = (i * 0.04 + 0.05) * 1000;
        const timer = window.setTimeout(() => {
          playTypeClick();
        }, delay);
        timers.push(timer);
      });
      return () => timers.forEach(clearTimeout);
    }
  }, [isGenerating, words]);

  const handleWordClick = useCallback(
    (e: React.MouseEvent | React.KeyboardEvent, wordIndex: number) => {
      let clientX = 0;
      let clientY = 0;

      if ("clientX" in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      } else {
        // For keyboard events, center the particle on the element
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        clientX = rect.left + rect.width / 2;
        clientY = rect.top + rect.height / 2;
      }

      const id = Date.now() + Math.random();
      const currentClickCount = clickCounts[wordIndex] || 0;
      const effectIndex =
        (currentClickCount + Math.max(0, wordIndex) + 1) %
        EFFECT_VARIATIONS.length;
      const effect = EFFECT_VARIATIONS[effectIndex];

      const newParticle: Particle = {
        id,
        x: clientX,
        y: clientY,
        emoji: effect.emoji,
        type: effect.type,
      };

      setClickCounts((prev) => ({
        ...prev,
        [wordIndex]: (prev[wordIndex] || 0) + 1,
      }));

      setParticles((prev) => [...prev, newParticle]);
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== id));
      }, 1500);

      if (wordIndex === -1) {
        setIsBloomed(true);
        setTimeout(() => setIsBloomed(false), 4000);
      }
    },
    [clickCounts],
  );

  const handleResetClick = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.8 },
      colors: ["#FF0000", "#FFB6C1", "#FFFFFF", "#FF69B4"],
    });
    setTimeout(onReset, 500);
  };

  const getParticleVariants = (type: string) => {
    switch (type) {
      case "float-up":
        return {
          initial: { opacity: 0, scale: 0, y: 0 },
          animate: { opacity: [0, 1, 0], scale: [0, 1.5, 1], y: -100 },
        };
      case "sparkle":
        return {
          initial: { opacity: 0, scale: 0, rotate: 0 },
          animate: { opacity: [0, 1, 0], scale: [0, 2, 0], rotate: 180 },
        };
      case "petal":
        return {
          initial: { opacity: 0, x: 0, rotate: 0 },
          animate: { opacity: [0, 1, 0], x: [0, 30, -30], y: -80, rotate: 360 },
        };
      case "zoom":
        return {
          initial: { opacity: 0, scale: 0.5 },
          animate: { opacity: [0, 1, 0], scale: [0.5, 3, 0.5] },
        };
      case "spin":
        return {
          initial: { opacity: 0, rotate: 0, scale: 0 },
          animate: {
            opacity: [0, 1, 0],
            rotate: 720,
            scale: [0, 1.8, 0],
            y: -40,
          },
        };
      case "drift":
        return {
          initial: { opacity: 0, x: 0 },
          animate: { opacity: [0, 1, 0], x: [0, 50], y: -120 },
        };
      case "fly":
        return {
          initial: { opacity: 0, x: 0, y: 0 },
          animate: { opacity: [0, 1, 0], x: [-60, 60], y: [-60, -120] },
        };
      case "arc":
        return {
          initial: { opacity: 0, x: 0, y: 0 },
          animate: { opacity: [0, 1, 0], x: [0, 40], y: [0, -40, 0] },
        };
      default:
        return { initial: { opacity: 0 }, animate: { opacity: 1 } };
    }
  };

  const backgroundPetals = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      emoji: PETAL_TYPES[i % PETAL_TYPES.length],
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 25}s`,
      duration: `${12 + Math.random() * 12}s`,
      size: `${12 + Math.random() * 20}px`,
      opacity: 0.05 + Math.random() * 0.2,
    }));
  }, []);

  const wordRevealVariants = {
    hidden: { opacity: 0, y: 10, filter: "blur(4px)" },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.04 + 0.05,
        duration: 0.4,
        ease: "easeOut",
      },
    }),
  };

  return (
    <div
      className="bg-white rounded-[2rem] shadow-2xl p-8 md:p-12 text-center border-4 border-rose-50 border-double relative overflow-hidden"
      role="main"
    >
      {/* Background Animated Petals */}
      {backgroundPetals.map((petal) => (
        <div
          key={petal.id}
          className="petal select-none"
          aria-hidden="true"
          style={{
            left: petal.left,
            top: "-60px",
            fontSize: petal.size,
            animationDelay: petal.delay,
            animationDuration: petal.duration,
            opacity: petal.opacity,
          }}
        >
          {petal.emoji}
        </div>
      ))}

      {/* Click Particles Layer */}
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            variants={getParticleVariants(p.type)}
            initial="initial"
            animate="animate"
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="fixed pointer-events-none z-50 text-3xl"
            style={{ left: p.x - 15, top: p.y - 15 }}
            aria-hidden="true"
          >
            {p.emoji}
          </motion.div>
        ))}
      </AnimatePresence>

      <div
        className="absolute top-0 left-0 p-4 opacity-50 text-2xl select-none z-10"
        aria-hidden="true"
      >
        🌹
      </div>
      <div
        className="absolute top-0 right-0 p-4 opacity-50 text-2xl select-none z-10"
        aria-hidden="true"
      >
        🌹
      </div>
      <div
        className="absolute bottom-0 left-0 p-4 opacity-50 text-2xl select-none z-10"
        aria-hidden="true"
      >
        🌹
      </div>
      <div
        className="absolute bottom-0 right-0 p-4 opacity-50 text-2xl select-none z-10"
        aria-hidden="true"
      >
        🌹
      </div>

      <div className="max-w-xl mx-auto space-y-8 relative z-10">
        <div className="relative inline-block">
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{
              scale: isBloomed ? [1, 1.4, 1.25] : [1, 1.05, 1],
              rotate: isBloomed ? [0, 15, -15, 0] : [0, 5, -5, 0],
              filter: isBloomed
                ? "drop-shadow(0 0 20px rgba(244, 63, 94, 0.4))"
                : "drop-shadow(0 10px 15px rgba(0,0,0,0.1))",
            }}
            whileHover={{
              scale: [1, 1.15, 1],
              filter: "drop-shadow(0 0 15px rgba(244, 63, 94, 0.6))",
              transition: { repeat: Infinity, duration: 0.6 },
            }}
            transition={{
              initial: { type: "spring", damping: 10, stiffness: 100 },
              animate: {
                scale: {
                  duration: isBloomed ? 0.6 : 2,
                  repeat: isBloomed ? 0 : Infinity,
                  ease: "easeInOut",
                },
                rotate: {
                  duration: isBloomed ? 0.6 : 4,
                  repeat: isBloomed ? 0 : Infinity,
                  ease: "easeInOut",
                },
              },
            }}
            className="text-8xl cursor-pointer select-none relative z-20 outline-none focus-visible:ring-4 focus-visible:ring-rose-200 rounded-full"
            onClick={(e) => handleWordClick(e, -1)}
            onKeyDown={(e) => e.key === "Enter" && handleWordClick(e, -1)}
            role="button"
            tabIndex={0}
            aria-label="Interactive magic rose. Click for a surprise."
          >
            🌹
          </motion.div>

          <AnimatePresence>
            {isBloomed && (
              <motion.div
                initial={{ opacity: 0, scale: 0, y: 0 }}
                animate={{ opacity: 1, scale: 1, y: -60 }}
                exit={{ opacity: 0, scale: 0.5, y: -100 }}
                className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
                aria-live="polite"
              >
                <div className="flex flex-col items-center">
                  <span className="text-4xl">❤️</span>
                  <span className="text-rose-500 font-romantic font-bold text-xl mt-1 drop-shadow-sm bg-white/80 px-3 py-1 rounded-full whitespace-nowrap">
                    Forever Yours
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-2">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl shimmer-text font-romantic font-bold"
          >
            Happy Rose Day
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-serif-elegant font-bold text-gray-800"
          >
            Hey {name}!
          </motion.h2>
        </div>

        <div className="relative p-6 md:p-10 bg-rose-50/80 backdrop-blur-sm rounded-2xl border-2 border-rose-100 italic shadow-inner min-h-[160px] flex items-center justify-center">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 bg-white rounded-full border border-rose-100 text-rose-500 text-xs font-bold uppercase tracking-widest py-1 shadow-sm">
            A Special Note
          </div>

          {isGenerating ? (
            <CompactLoading label="Selecting the best note..." />
          ) : (
            <div
              className="text-gray-700 text-lg md:text-xl font-serif-elegant flex flex-wrap justify-center gap-x-2 gap-y-3 leading-[1.8] md:leading-[2.2]"
              style={{ wordSpacing: "0.15em" }}
            >
              {words.length > 0 ? (
                words.map((word, i) => (
                  <motion.span
                    key={i}
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    variants={wordRevealVariants}
                    whileHover={{
                      scale: 1.15,
                      color: "#f43f5e",
                      rotate: i % 2 === 0 ? 2 : -2,
                    }}
                    onClick={(e) => handleWordClick(e, i)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleWordClick(e, i)
                    }
                    role="button"
                    tabIndex={0}
                    aria-label={`Interactive word: ${word}. Click for an effect.`}
                    className="cursor-pointer transition-all inline-block py-0.5 px-1 rounded-md hover:bg-rose-100/60 select-none outline-none focus-visible:bg-rose-100"
                  >
                    {word}
                  </motion.span>
                ))
              ) : (
                <span className="text-gray-400">
                  Sending you love across the miles...
                </span>
              )}
            </div>
          )}

          {!isGenerating && words.length > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="absolute -bottom-6 left-0 w-full text-[10px] text-rose-300 uppercase tracking-widest font-sans font-bold"
            >
              ✨ Tap the rose or any word for a surprise ✨
            </motion.p>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleResetClick}
          aria-label="Restart and send another rose"
          className="inline-block bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-rose-200 transition-all text-sm uppercase tracking-widest outline-none focus-visible:ring-4 focus-visible:ring-rose-300"
        >
          Send another rose 🔄
        </motion.button>
      </div>
    </div>
  );
};

export default ResultScreen;
