import React from 'react';
import { FactData } from '../types';

const Fact: React.FC<{ factData: FactData | null }> = ({ factData }) => {
  if (!factData) return null;

  return (
    <div className="text-center mb-4">
      <p className="text-xl">"{factData.content}"</p>
    </div>
  );
};

export default Fact;