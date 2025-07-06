import React, { useState, useEffect, useMemo } from 'react';

interface DateTimeState {
  time: string;
  date: string;
}

const dateFormatOptions: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

const formatTime = (date: Date): string => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', dateFormatOptions);
};

const getCurrentDateTime = (): DateTimeState => {
  const now = new Date();
  return {
    time: formatTime(now),
    date: formatDate(now),
  };
};

const Clock: React.FC = () => {
  const [dateTime, setDateTime] = useState<DateTimeState>(() => getCurrentDateTime());

  useEffect(() => {
    // Calculate time until next minute
    const now = new Date();
    const delay = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();

    const timeoutId = setTimeout(() => {
      // Update immediately and then every minute
      setDateTime(getCurrentDateTime());
      const intervalId = setInterval(() => {
        setDateTime(getCurrentDateTime());
      }, 60000); // Update every minute

      return () => clearInterval(intervalId);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="text-center">
      <div className="text-6xl md:text-8xl font-light text-white mb-2 tracking-wider">
        {dateTime.time}
      </div>
      <div className="text-xl md:text-2xl text-gray-50">
        {dateTime.date}
      </div>
    </div>
  );
};

export default React.memo(Clock);