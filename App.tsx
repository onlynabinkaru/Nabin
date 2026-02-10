import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { AppState } from "./types";
import LoadingScreen from "./components/LoadingScreen";
import NameInput from "./components/NameInput";
import ChoiceScreen from "./components/ChoiceScreen";
import ResultScreen from "./components/ResultScreen";
import { generateBestRoseDayNote, NoteStyle } from "./services/geminiService";
import { playChime } from "./utils/audio";

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.LOADING);
  const [partnerName, setPartnerName] = useState<string>("");
  const [loveNote, setLoveNote] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  useEffect(() => {
    // Reduced initial loading time for a snappier feel
    const timer = setTimeout(() => {
      setState(AppState.NAME_INPUT);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleNameSubmit = useCallback((name: string) => {
    setPartnerName(name);
    setState(AppState.CHOICE);
  }, []);

  const handleAccept = useCallback(
    async (style: NoteStyle) => {
      playChime();
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#FF0000", "#FFB6C1", "#FFFFFF"],
      });

      setState(AppState.RESULT);
      setIsGenerating(true);

      try {
        const note = await generateBestRoseDayNote(partnerName, style);
        setLoveNote(note);
      } catch (e) {
        setLoveNote(
          `To my beautiful ${partnerName}, distance means so little when someone means so much. Happy Rose Day!`,
        );
      } finally {
        setIsGenerating(false);
      }
    },
    [partnerName],
  );

  const handleReset = useCallback(() => {
    setState(AppState.LOADING);
    setPartnerName("");
    setLoveNote("");
    // Reduced reset delay for faster restart
    setTimeout(() => {
      setState(AppState.NAME_INPUT);
    }, 2500);
  }, []);

  return (
    <div className="min-h-screen flex items-start md:items-center justify-center p-4 py-12 md:py-4 relative bg-[#FFF5F5]">
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-20 z-0">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute text-rose-300 animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 20 + 20}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 4 + 4}s`,
            }}
          >
            🌹
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {state === AppState.LOADING && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-md relative z-10"
          >
            <LoadingScreen />
          </motion.div>
        )}

        {state === AppState.NAME_INPUT && (
          <motion.div
            key="input"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="w-full max-w-md relative z-10"
          >
            <NameInput onSubmit={handleNameSubmit} />
          </motion.div>
        )}

        {state === AppState.CHOICE && (
          <motion.div
            key="choice"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-lg relative z-10"
          >
            <ChoiceScreen name={partnerName} onAccept={handleAccept} />
          </motion.div>
        )}

        {state === AppState.RESULT && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl relative z-10"
          >
            <ResultScreen
              name={partnerName}
              note={loveNote}
              isGenerating={isGenerating}
              onReset={handleReset}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
