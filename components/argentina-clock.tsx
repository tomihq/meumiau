'use client'; 

import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react'; 

const ArgentinaClock: React.FC = () => {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      
      const argentinaTime = now.toLocaleString('en-US', {
        timeZone: 'America/Argentina/Buenos_Aires',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false 
      });
      setTime(argentinaTime);
    };

    updateTime();

    const intervalId = setInterval(updateTime, 1000);

    return () => clearInterval(intervalId);
  }, []); 

  return (
    <div className="m-8 flex justify-center">
      <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md border border-purple-500/30 rounded-full px-4 py-2 text-purple-300 font-mono text-lg shadow-lg">
        <Clock className="w-5 h-5 text-purple-400" />
        <span className="text-lg">
          Argentina time: <span className="text-white">{time}</span>
        </span>
      </div>
    </div>
  );
};

export default ArgentinaClock;