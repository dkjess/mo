import React from 'react';
import { stations, lineColors } from '../data/stations';

interface StationInfoProps {
  station: string;
}

export const StationInfo: React.FC<StationInfoProps> = ({ station }) => {
  return (
    <div className="flex gap-1 mt-1">
      {stations[station].lines.map(line => (
        <span
          key={line}
          className={`
            inline-flex px-2 py-0.5 rounded-full text-sm font-medium 
            ${line === 'M1' ? 'bg-[#009E49] text-white' : ''}
            ${line === 'M2' ? 'bg-[#FECA0A] text-black' : ''}
            ${line === 'M3' ? 'bg-[#EE1C25] text-white' : ''}
            ${line === 'M4' ? 'bg-[#0090D0] text-white' : ''}
          `}
        >
          {line}
        </span>
      ))}
    </div>
  );
};