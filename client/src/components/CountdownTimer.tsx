import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  endTime?: Date;
  isSold?: boolean;
}

export default function CountdownTimer({ endTime, isSold = false }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (isSold) return;

    const targetTime = endTime || new Date(Date.now() + 2 * 60 * 60 * 1000 + 14 * 60 * 1000 + 32 * 1000); // 2:14:32

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetTime.getTime() - now;

      if (distance > 0) {
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft({ hours, minutes, seconds });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime, isSold]);

  if (isSold) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full"
      >
        <span className="text-red-400 text-xs font-medium uppercase tracking-widest">
          SOLD OUT
        </span>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="inline-flex items-center gap-3 px-4 py-2 bg-yellow-400/10 border border-yellow-400/20 rounded-full backdrop-blur-sm"
    >
      <Clock size={14} className="text-yellow-400" />
      <span className="text-yellow-400 text-xs font-medium uppercase tracking-widest">
        Drop ends in {timeLeft.hours.toString().padStart(2, '0')}:{timeLeft.minutes.toString().padStart(2, '0')}:{timeLeft.seconds.toString().padStart(2, '0')}
      </span>
    </motion.div>
  );
}