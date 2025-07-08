import React from 'react';
import { FactData } from '../types';

const Fact: React.FC<{ factData: FactData | null }> = ({ factData }) => {
  if (!factData) return null;

  return (
    <div className="text-center mb-8">
      <p className="text-2xl">"{factData.content}"</p>
      <p className="text-lg text-white/20">— {factData.category}</p>
    </div>
  );
};

export default Fact;