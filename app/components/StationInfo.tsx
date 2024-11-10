import React from 'react';
import { stations, lineColors } from '../data/stations';

interface StationInfoProps {
  station: string;
}

const LineLabel: React.FC<{ line: string }> = ({ line }) => {
  return (
    <span
      style={{
        backgroundColor: lineColors[line].bg,
        color: lineColors[line].text,
        padding: '2px 6px',
        borderRadius: '12px',
        fontWeight: 'bold',
        fontSize: '0.9em',
        marginRight: '5px'
      }}
    >
      {line}
    </span>
  );
};

export const StationInfo: React.FC<StationInfoProps> = ({ station }) => {
  return (
    <div className="mb-2">
      <strong>{station}</strong>
      <div>
        {stations[station].lines.map(line => (
          <LineLabel key={line} line={line} />
        ))}
      </div>
    </div>
  );
};