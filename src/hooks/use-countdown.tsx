import { useState, useEffect } from 'react';

interface UseCountdownOptions {
  duration?: number; // Animation duration in milliseconds
  delay?: number; // Delay before starting animation
}

export const useCountdown = (targetValue: number, options: UseCountdownOptions = {}) => {
  const { duration = 800, delay = 100 } = options;
  const [displayValue, setDisplayValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (targetValue === 0) {
      setDisplayValue(0);
      return;
    }

    const timer = setTimeout(() => {
      setIsAnimating(true);
      
      // Generate random starting value (1.5x to 3x the target value)
      const startValue = Math.floor(targetValue * (1.5 + Math.random() * 1.5));
      setDisplayValue(startValue);

      const startTime = Date.now();
      const endTime = startTime + duration;

      const animate = () => {
        const currentTime = Date.now();
        const progress = Math.min((currentTime - startTime) / duration, 1);
        
        // Easing function for smooth animation
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        const currentValue = Math.floor(startValue - (startValue - targetValue) * easeOut);
        setDisplayValue(currentValue);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setDisplayValue(targetValue);
          setIsAnimating(false);
        }
      };

      requestAnimationFrame(animate);
    }, delay);

    return () => clearTimeout(timer);
  }, [targetValue, duration, delay]);

  return { displayValue, isAnimating };
};
