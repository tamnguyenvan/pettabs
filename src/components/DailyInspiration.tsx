// src/components/DailyInspiration.tsx
import React, { useState, useEffect } from 'react';
import { WORKER_URL } from '../lib/constants';

interface Inspiration {
  content: string;
  author: string | null;
}

const DailyInspiration: React.FC = () => {
  const [inspiration, setInspiration] = useState<Inspiration | null>(null);

  useEffect(() => {
    const fetchInspiration = async () => {
      try {
        const response = await fetch(`${WORKER_URL}/api/inspiration`);
        if (response.ok) {
          const data: Inspiration = await response.json();
          setInspiration(data);
        }
      } catch (error) {
        console.error("Failed to fetch inspiration:", error);
        // Fallback to a default quote if API fails
        setInspiration({ content: "Have a great day!", author: "Pettabs" });
      }
    };
    fetchInspiration();
  }, []);

  if (!inspiration) return <h1 className="text-3xl md:text-5xl font-medium h-20"></h1>; // Placeholder for loading

  return (
    <div className="text-center">
      <h1 className="text-3xl md:text-5xl font-medium text-white text-center mb-4 tracking-tight leading-tight">
        "{inspiration.content}"
      </h1>
      {inspiration.author && (
          <p className="text-lg text-white/70">— {inspiration.author}</p>
      )}
    </div>
  );
};

export default DailyInspiration;