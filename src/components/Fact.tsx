import React, { useState, useEffect } from 'react';
import { WORKER_URL } from '../lib/constants';

interface FactData {
  content: string;
  category: string;
}

const Fact: React.FC = () => {
  const [fact, setFact] = useState<FactData | null>(null);

  useEffect(() => {
    const fetchFact = async () => {
      try {
        // Có thể thêm ?category=cat hoặc dog ở đây nếu muốn fact liên quan đến ảnh nền
        const response = await fetch(`${WORKER_URL}/api/fact`);
        if (response.ok) {
          const data: FactData = await response.json();
          setFact(data);
        }
      } catch (error) {
        console.error("Failed to fetch fact:", error);
      }
    };
    fetchFact();
  }, []);

  if (!fact) return null;

  return (
    <div className="text-center mb-8">
      <p className="text-xl md:text-2xl font-medium text-white/90 italic mb-2">
        "{fact.content}"
      </p>
      <p className="text-sm text-white/60 capitalize">
        — {fact.category} Fact
      </p>
    </div>
  );
};

export default Fact;