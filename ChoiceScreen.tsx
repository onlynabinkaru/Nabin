
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { NoteStyle } from '../services/geminiService';

interface ChoiceScreenProps {
  name: string;
  onAccept: (style: NoteStyle) => void;
}

const ChoiceScreen: React.FC<ChoiceScreenProps> = ({ name, onAccept }) => {
  const [selectedStyle, setSelectedStyle] = useState<NoteStyle>('Poetic');
  const [noButtonStyle, setNoButtonStyle] = useState<React.CSSProperties>({});
  const containerRef = useRef<HTMLDivElement>(null);

  const moveNoButton = () => {
    const maxX = 120;
    const maxY = 120;
    const randomX = (Math.random() - 0.5) * maxX * 2;
    const randomY = (Math.random() - 0.5) * maxY * 2;
    
    setNoButtonStyle({
      transform: `translate(${randomX}px, ${randomY}px)`,
      transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    });
  };

  const handleAcceptClick = () => {
    // Immediate small confetti burst on button click
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#f43f5e', '#fb7185', '#ffffff', '#fda4af'],
      gravity: 1.2,
      scalar: 0.8
    });
    onAccept(selectedStyle);
  };

  const styles: { id: NoteStyle; label: string; icon: string }[] = [
    { id: 'Poetic', label: 'Poetic', icon: '🖋️' },
    { id: 'Simple', label: 'Simple', icon: '✨' },
    { id: 'Playful', label: 'Cute', icon: '😋' },
    { id: 'Humorous', label: 'Funny', icon: '😂' },
    { id: 'Empathetic', label: 'Warm', icon: '🫂' },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 text-center space-y-8 border-4 border-rose-100 relative overflow-visible" ref={containerRef}>
      <div className="text-6xl mb-4 animate-bounce">🌹</div>
      
      <div className="space-y-2">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">For You, {name}</h2>
        <p className="text-gray-500 font-medium px-4">
          How should I express my love today?
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {styles.map((style) => (
          <motion.button
            key={style.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedStyle(style.id)}
            aria-pressed={selectedStyle === style.id}
            aria-label={`Select ${style.label} style`}
            className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
              selectedStyle === style.id 
                ? 'border-rose-500 bg-rose-50 text-rose-600' 
                : 'border-gray-100 bg-gray-50 text-gray-400'
            }`}
          >
            <span className="text-2xl mb-1" aria-hidden="true">{style.icon}</span>
            <span className="text-xs font-bold uppercase tracking-tighter">{style.label}</span>
          </motion.button>
        ))}
      </div>

      <div className="flex flex-col items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAcceptClick}
          aria-label="Confirm choice and generate rose note"
          className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-5 rounded-2xl shadow-xl shadow-rose-200 text-xl"
        >
          Yes, I will! ❤️
        </motion.button>

        <button
          onMouseEnter={moveNoButton}
          onClick={moveNoButton}
          style={noButtonStyle}
          aria-label="No (this button moves away)"
          className="px-6 py-2 bg-gray-100 text-gray-400 rounded-full text-sm font-semibold border border-gray-200 transition-colors hover:bg-gray-200"
        >
          No
        </button>
      </div>
      
      <p className="text-xs text-rose-300 font-medium italic">
        (Psst... the No button is broken 😉)
      </p>
    </div>
  );
};

export default ChoiceScreen;
