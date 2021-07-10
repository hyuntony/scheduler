import { useState } from 'react';

const useVisualMode = (initial) => {
  const [history, setHistory] = useState([initial]);

  const transition = (property, replace = false) => {
    
    setHistory((prev) => {
      const newHistory = [...prev];

      if (replace) {
        newHistory.pop();
      }

      newHistory.push(property);
      return newHistory;
    });
  };

  const back = () => {
    if (history.length < 2) {
      return;
    }

    setHistory(prev => {
      const newHistory = [...prev];
      newHistory.pop();
      return newHistory;
    });
  }
  const mode = history[history.length-1];
  return { mode, transition, back };
}

export default useVisualMode;