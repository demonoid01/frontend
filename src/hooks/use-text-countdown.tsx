import { useState, useEffect } from 'react';

interface UseTextCountdownOptions {
  duration?: number; // Animation duration in milliseconds
  delay?: number; // Delay before starting animation
  trigger?: boolean; // External trigger to start animation
}

export const useTextCountdown = (targetValue: string, options: UseTextCountdownOptions = {}) => {
  const { duration = 800, delay = 100, trigger = true } = options;
  const [displayValue, setDisplayValue] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!targetValue || !trigger) {
      setDisplayValue('');
      return;
    }

    const timer = setTimeout(() => {
      setIsAnimating(true);
      
      // Generate random starting text (similar length but different characters)
      const generateRandomText = (target: string) => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < target.length; i++) {
          if (target[i] === ' ') {
            result += ' ';
          } else if (target[i] === '+') {
            result += '+';
          } else if (target[i] === '/') {
            result += '/';
          } else if (target[i] === '~') {
            result += '~';
          } else if (target[i] === 'x') {
            result += 'x';
          } else if (target[i] === '.') {
            result += '.';
          } else if (target[i] === '-') {
            result += '-';
          } else {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
          }
        }
        return result;
      };

      const startValue = generateRandomText(targetValue);
      setDisplayValue(startValue);

      const startTime = Date.now();
      const endTime = startTime + duration;

      const animate = () => {
        const currentTime = Date.now();
        const progress = Math.min((currentTime - startTime) / duration, 1);
        
        // Easing function for smooth animation
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        // Gradually reveal the target text
        let currentValue = '';
        for (let i = 0; i < targetValue.length; i++) {
          if (progress >= (i / targetValue.length)) {
            currentValue += targetValue[i];
          } else {
            currentValue += startValue[i];
          }
        }
        
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
  }, [targetValue, duration, delay, trigger]);

  return { displayValue, isAnimating };
};
