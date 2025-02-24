import React, { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Set next release time to midnight EST
    const calculateTimeLeft = () => {
      const now = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const difference = tomorrow.getTime() - now.getTime();
      
      return {
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full bg-gradient-to-r from-black/60 via-primary/20 to-black/60 backdrop-blur-sm border-y border-white/10">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-center">
          <div className="flex items-center gap-2 text-white">
            <Timer size={18} className="text-primary animate-pulse" />
            <span className="text-sm sm:text-base font-medium">Next Winning Product Released In:</span>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4 font-mono">
            <div className="flex items-center gap-1">
              <div className="bg-white/10 rounded px-2 py-1 min-w-[2.5rem]">
                <span className="text-lg sm:text-xl font-bold text-primary">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
              </div>
              <span className="text-white/60 text-sm">h</span>
            </div>
            
            <div className="flex items-center gap-1">
              <div className="bg-white/10 rounded px-2 py-1 min-w-[2.5rem]">
                <span className="text-lg sm:text-xl font-bold text-primary">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
              </div>
              <span className="text-white/60 text-sm">m</span>
            </div>
            
            <div className="flex items-center gap-1">
              <div className="bg-white/10 rounded px-2 py-1 min-w-[2.5rem]">
                <span className="text-lg sm:text-xl font-bold text-primary">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
              </div>
              <span className="text-white/60 text-sm">s</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;