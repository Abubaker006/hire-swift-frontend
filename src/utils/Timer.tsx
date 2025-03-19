"use client";
import React, { useEffect, useRef, useState } from "react";
import { formatScheduledTime } from "./dateFormatter";

interface CountdownTimerProps {
  targetTime: string;
  handleDisableTimer: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetTime,
  handleDisableTimer,
}) => {
  const hasValidated = useRef(false);

  const calculateTimeLeft = () => {
    const now = new Date();
    const targetDate = new Date(targetTime);
    const difference = targetDate.getTime() - now.getTime();

    if (difference <= 0) {
      return { hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      hours: Math.floor(difference / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      if (hasValidated.current) return;
      if (
        newTimeLeft.hours === 0 &&
        newTimeLeft.minutes === 0 &&
        newTimeLeft.seconds === 0
      ) {
        hasValidated.current = true;
        console.log("Calling");
        handleDisableTimer();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetTime]);

  return (
    <div className="relative w-full min-h-screen inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-black via-black to-[#5E17EB] text-white">
      <h1 className="text-2xl md:text-3xl font-semibold mb-4 animate-pulse text-center">
        Time left in scheduled assessment
      </h1>
      <div className="text-2xl md:text-3xl font-semibold">
        {`${timeLeft?.hours.toString().padStart(2, "0")}:${timeLeft?.minutes
          .toString()
          .padStart(2, "0")}:${timeLeft?.seconds.toString().padStart(2, "0")}`}
      </div>
      <div className="mt-4 text-sm md:text-2xl font-thin">
        The assessment will commence at {formatScheduledTime(targetTime)}
      </div>
    </div>
  );
};

export default CountdownTimer;
