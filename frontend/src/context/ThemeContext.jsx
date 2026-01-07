// src/context/ThemeContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe usarse dentro de ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    // Cargar preferencia guardada o usar dark por defecto
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });

  const [textScale, setTextScale] = useState(() => {
    const saved = localStorage.getItem('textScale');
    const parsed = saved ? parseInt(saved, 10) : 100;
    return Number.isNaN(parsed) ? 100 : parsed;
  });

  const [speakOnHover, setSpeakOnHover] = useState(() => {
    const saved = localStorage.getItem('speakOnHover');
    return saved ? saved === 'true' : false;
  });

  useEffect(() => {
    // Aplicar clase al documento
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    const clamped = Math.min(140, Math.max(80, textScale));
    document.documentElement.style.setProperty('--text-scale', `${clamped}%`);
    localStorage.setItem('textScale', String(clamped));
  }, [textScale]);

  useEffect(() => {
    localStorage.setItem('speakOnHover', String(speakOnHover));

    if (!speakOnHover) {
      window.speechSynthesis?.cancel();
      return undefined;
    }

    const handler = (event) => {
      const target = event.target;
      if (!target) return;
      const label = target.getAttribute?.('aria-label') || target.innerText;
      const text = label?.trim();
      if (!text) return;
      const utterance = new SpeechSynthesisUtterance(text.slice(0, 180));
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    };

    document.addEventListener('mouseover', handler, true);
    document.addEventListener('focus', handler, true);

    return () => {
      document.removeEventListener('mouseover', handler, true);
      document.removeEventListener('focus', handler, true);
    };
  }, [speakOnHover]);

  const toggleTheme = () => {
    setDarkMode(prev => !prev);
  };

  const increaseText = () => setTextScale(prev => Math.min(140, prev + 10));
  const decreaseText = () => setTextScale(prev => Math.max(80, prev - 10));
  const toggleSpeak = () => setSpeakOnHover(prev => !prev);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme, textScale, increaseText, decreaseText, speakOnHover, toggleSpeak }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;