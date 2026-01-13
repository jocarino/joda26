"use client";

import { useState, useEffect } from "react";

interface CountdownProps {
  targetDate: Date | string | number;
}

export default function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !targetDate) return;

    const calculateTimeLeft = () => {
      const now = new Date();
      // Convert targetDate to Date object (handles Date, string, or timestamp)
      let target: Date;
      if (targetDate instanceof Date) {
        target = new Date(targetDate);
      } else if (
        typeof targetDate === "string" ||
        typeof targetDate === "number"
      ) {
        target = new Date(targetDate);
      } else {
        return;
      }

      // Set to start of day in local timezone
      target.setHours(0, 0, 0, 0);

      const nowTime = now.getTime();
      const targetTime = target.getTime();
      const difference = targetTime - nowTime;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        // If date has passed, show zeros
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    // Calculate immediately
    calculateTimeLeft();
    // Then update every second
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [targetDate, mounted]);

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="py-16 bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="uppercase text-2xl md:text-3xl font-serif mb-8 tracking-wide font-normal">
            Our special day is in…
          </h2>
          <div className="flex justify-center items-center gap-6 md:gap-12 flex-wrap">
            <div className="text-center">
              <div className="text-5xl md:text-7xl font-bold mb-2 font-sans">
                0
              </div>
              <div className="text-xs md:text-sm uppercase tracking-widest">
                Days
              </div>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-7xl font-bold mb-2 font-sans">
                0
              </div>
              <div className="text-xs md:text-sm uppercase tracking-widest">
                Hours
              </div>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-7xl font-bold mb-2 font-sans">
                0
              </div>
              <div className="text-xs md:text-sm uppercase tracking-widest">
                Minutes
              </div>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-7xl font-bold mb-2 font-sans">
                0
              </div>
              <div className="text-xs md:text-sm uppercase tracking-widest">
                Seconds
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="uppercase text-2xl md:text-3xl font-serif mb-8 tracking-wide font-normal">
          Our special day is in…
        </h2>
        <div className="flex justify-center items-center gap-6 md:gap-12 flex-wrap">
          <div className="text-center">
            <div className="text-5xl md:text-7xl font-bold mb-2 font-sans">
              {timeLeft.days}
            </div>
            <div className="text-xs md:text-sm uppercase tracking-widest">
              Days
            </div>
          </div>
          <div className="text-center">
            <div className="text-5xl md:text-7xl font-bold mb-2 font-sans">
              {timeLeft.hours}
            </div>
            <div className="text-xs md:text-sm uppercase tracking-widest">
              Hours
            </div>
          </div>
          <div className="text-center">
            <div className="text-5xl md:text-7xl font-bold mb-2 font-sans">
              {timeLeft.minutes}
            </div>
            <div className="text-xs md:text-sm uppercase tracking-widest">
              Minutes
            </div>
          </div>
          <div className="text-center">
            <div className="text-5xl md:text-7xl font-bold mb-2 font-sans">
              {timeLeft.seconds}
            </div>
            <div className="text-xs md:text-sm uppercase tracking-widest">
              Seconds
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
