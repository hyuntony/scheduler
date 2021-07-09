import { useState } from 'react';

const useVisualMode = (initial) => {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = (property, replace = false) => {
    if (replace === true) {
      const arr = [...history];
      arr.splice(-1, 1, property)
      setHistory(arr);
      return setMode(property);
    }
    setHistory((prev) => {
      prev.push(property);
      return prev
    });
    setMode(property);
  }
  const back = () => {
    const arr = [...history];
    if (arr.length === 1) {
      return;
    }
    arr.pop();
    setHistory(arr);
    setMode(() => {
      return arr[arr.length-1]
    });
  }
  
  return { mode, transition, back };
}

export default useVisualMode;