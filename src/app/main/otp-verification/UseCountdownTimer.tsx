import { useState } from "react";

// Define the countdown timer custom hook
export const useCountdownTimer = (initialTime: number) => {
  const [timer, setTimer] = useState<number>(initialTime);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Function to start the countdown timer
  const startTimer = () => {
    setIsTimerRunning(true);
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer === 0) {
          clearInterval(interval);
          setIsTimerRunning(false);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  // Function to reset the countdown timer
  const resetTimer = () => {
    setTimer(initialTime);
    setIsTimerRunning(false);
  };

  return { timer, isTimerRunning, startTimer, resetTimer };
};
