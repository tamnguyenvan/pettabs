import React, { useState, useEffect } from 'react';

const Clock: React.FC = () => {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format time (HH:MM)
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };

    // Update immediately and set interval (update every minute instead of every second)
    updateTime();
    const timer = setInterval(updateTime, 1000);

    // Clean up interval on component unmount
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-center">
      <div className="text-8xl md:text-[10rem] font-light text-white mb-2 tracking-wider">
        {time}
      </div>
    </div>
  );
};

export default Clock;