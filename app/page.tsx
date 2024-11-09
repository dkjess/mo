"use client";

import React, { useState, useEffect } from 'react';

interface Station {
  name: string;
  layout: 'A' | 'B';
}

interface StationType {
  layout: 'A' | 'B';
  lines: string[];
}

interface StationsMap {
  [key: string]: StationType;
}

interface LineColors {
  bg: string;
  text: string;
}

interface LineColorMap {
  [key: string]: LineColors;
}

interface PathResult {
  distance: number;
  instruction: string;
}

const lines: { [key: string]: Station[] } = {
  M1: [
    { name: 'Vanløse', layout: 'A' },
    { name: 'Flintholm', layout: 'B' },
    { name: 'Lindevang', layout: 'A' },
    { name: 'Fasanvej', layout: 'B' },
    { name: 'Frederiksberg', layout: 'A' },
    { name: 'Forum', layout: 'B' },
    { name: 'Nørreport', layout: 'A' },
    { name: 'Kongens Nytorv', layout: 'B' },
    { name: 'Christianshavn', layout: 'A' },
    { name: 'Islands Brygge', layout: 'B' },
    { name: 'DR Byen', layout: 'A' },
    { name: 'Sundby', layout: 'B' },
    { name: 'Bella Center', layout: 'A' },
    { name: 'Ørestad', layout: 'B' },
    { name: 'Vestamager', layout: 'A' }
  ],
  M2: [
    { name: 'Vanløse', layout: 'A' },
    { name: 'Flintholm', layout: 'B' },
    { name: 'Lindevang', layout: 'A' },
    { name: 'Fasanvej', layout: 'B' },
    { name: 'Frederiksberg', layout: 'A' },
    { name: 'Forum', layout: 'B' },
    { name: 'Nørreport', layout: 'A' },
    { name: 'Kongens Nytorv', layout: 'B' },
    { name: 'Christianshavn', layout: 'A' },
    { name: 'Amagerbro', layout: 'B' },
    { name: 'Lergravsparken', layout: 'A' },
    { name: 'Øresund', layout: 'B' },
    { name: 'Amager Strand', layout: 'A' },
    { name: 'Femøren', layout: 'B' },
    { name: 'Kastrup', layout: 'A' },
    { name: 'Lufthavnen', layout: 'B' }
  ],
  M3: [
    { name: 'Københavns Hovedbanegård', layout: 'A' },
    { name: 'Rådhuspladsen', layout: 'B' },
    { name: 'Gammel Strand', layout: 'A' },
    { name: 'Kongens Nytorv', layout: 'B' },
    { name: 'Marmorkirken', layout: 'A' },
    { name: 'Østerport', layout: 'B' },
    { name: 'Trianglen', layout: 'A' },
    { name: 'Poul Henningsens Plads', layout: 'B' },
    { name: 'Vibenshus Runddel', layout: 'A' },
    { name: 'Skjolds Plads', layout: 'B' },
    { name: 'Nørrebro', layout: 'A' },
    { name: 'Nørrebros Runddel', layout: 'B' },
    { name: 'Nuuks Plads', layout: 'A' },
    { name: 'Aksel Møllers Have', layout: 'B' },
    { name: 'Frederiksberg', layout: 'A' },
    { name: 'Frederiksberg Allé', layout: 'B' },
    { name: 'Enghave Plads', layout: 'A' }
  ],
  M4: [
    { name: 'Københavns Hovedbanegård', layout: 'A' },
    { name: 'Rådhuspladsen', layout: 'B' },
    { name: 'Gammel Strand', layout: 'A' },
    { name: 'Kongens Nytorv', layout: 'B' },
    { name: 'Marmorkirken', layout: 'A' },
    { name: 'Østerport', layout: 'B' },
    { name: 'Nordhavn', layout: 'A' },
    { name: 'Orientkaj', layout: 'B' }
  ]
};

// Create stations object with proper typing
const stations: StationsMap = Object.values(lines).flat().reduce((acc: StationsMap, station) => {
  if (!acc[station.name]) {
    acc[station.name] = { layout: station.layout, lines: [] };
  }
  return acc;
}, {});

// Populate lines for each station
Object.entries(lines).forEach(([line, stops]) => {
  stops.forEach(station => {
    if (!stations[station.name].lines.includes(line)) {
      stations[station.name].lines.push(line);
    }
  });
});

const getPosition = (start: string, end: string, line: string): string => {
  const lineStations = lines[line];
  const startIndex = lineStations.findIndex(s => s.name === start);
  const endIndex = lineStations.findIndex(s => s.name === end);
  const direction = startIndex < endIndex ? 'forward' : 'backward';
  const position = direction === 'forward' ? 
    (stations[end].layout === 'A' ? 'front' : 'back') :
    (stations[end].layout === 'A' ? 'back' : 'front');
  return position;
};

const findShortestPath = (start: string, end: string): PathResult | null => {
  const commonLines = stations[start].lines.filter(line => stations[end].lines.includes(line));
  
  if (commonLines.length === 0) return null;

  let shortestPath: PathResult | null = null;
  let shortestDistance = Infinity;

  commonLines.forEach(line => {
    const lineStations = lines[line];
    const startIndex = lineStations.findIndex(s => s.name === start);
    const endIndex = lineStations.findIndex(s => s.name === end);
    
    if (startIndex !== -1 && endIndex !== -1) {
      const distance = Math.abs(endIndex - startIndex);
      if (distance < shortestDistance) {
        shortestDistance = distance;
        const position = getPosition(start, end, line);
        shortestPath = {
          distance: distance,
          instruction: `Take the ${line} line. Be in the ${position} of the train from ${start} to ${end}.`
        };
      }
    }
  });

  return shortestPath;
};

const findBestRoute = (start: string, end: string): string[] => {
  if (!stations[start] || !stations[end]) {
    return ['Invalid station selection. Please try again.'];
  }

  const startStation = stations[start];
  const endStation = stations[end];

  // Check for direct route
  const directLine = startStation.lines.find(line => endStation.lines.includes(line));
  if (directLine) {
    const position = getPosition(start, end, directLine);
    return [`Take the ${directLine} line. Be in the ${position} of the train from ${start} to ${end}.`];
  }

  // Find all possible transfer stations
  const transferStations = Object.keys(stations).filter(station => 
    station !== start && 
    station !== end &&
    stations[station].lines.some(line => startStation.lines.includes(line)) &&
    stations[station].lines.some(line => endStation.lines.includes(line))
  );

  // Find the best transfer route
  let bestRoute: string[] | null = null;
  let shortestDistance = Infinity;

  transferStations.forEach(transferStation => {
    const firstLeg = findShortestPath(start, transferStation);
    const secondLeg = findShortestPath(transferStation, end);
    
    if (firstLeg && secondLeg) {
      const totalDistance = firstLeg.distance + secondLeg.distance;
      if (totalDistance < shortestDistance) {
        shortestDistance = totalDistance;
        bestRoute = [
          `1. ${firstLeg.instruction}`,
          `2. Transfer at ${transferStation}.`,
          `3. ${secondLeg.instruction}`
        ];
      }
    }
  });

  return bestRoute || ['No suitable route found. Please check the metro map.'];
};

interface PickerProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  label: string;
}

interface StationInfoProps {
  station: string;
}

interface LineLabelProps {
  line: string;
}

interface RouteDisplayProps {
  route: string | string[];
}

const LineLabel: React.FC<LineLabelProps> = ({ line }) => {
  const colors: LineColorMap = {
    M1: { bg: '#009E49', text: 'white' },
    M2: { bg: '#FECA0A', text: 'black' },
    M3: { bg: '#EE1C25', text: 'white' },
    M4: { bg: '#0090D0', text: 'white' }
  };

  return (
    <span
      style={{
        backgroundColor: colors[line].bg,
        color: colors[line].text,
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

const StationInfo: React.FC<StationInfoProps> = ({ station }) => {
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

const RouteDisplay: React.FC<RouteDisplayProps> = ({ route }) => {
  if (typeof route === 'string') {
    return <pre className="mt-4 p-2 bg-gray-100 rounded whitespace-pre-wrap text-sm">{route}</pre>;
  }

  return (
    <div className="mt-4 p-2 bg-gray-100 rounded text-sm">
      {route.map((step, index) => (
        <p key={index} className="mb-2">{step}</p>
      ))}
    </div>
  );
};

const Picker: React.FC<PickerProps> = ({ options, value, onChange, label }) => {
  return (
    <div className="flex flex-col items-center">
      <label className="mb-2 font-bold">{label}</label>
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 text-lg bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select station</option>
        {options.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

const CopenhagenMetroOptimizer: React.FC = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [route, setRoute] = useState('Where are you and where are you going?');

  useEffect(() => {
    if (origin && destination) {
      const bestRoute = findBestRoute(origin, destination);
      setRoute(bestRoute);
    } else if (origin && !destination) {
      setRoute('Where are you headed?');
    } else if (!origin && destination) {
      setRoute('Where are you leaving from?');
    } else {
      setRoute('Where are you and where are you going?');
    }
  }, [origin, destination]);

  const allStations = Object.keys(stations).sort();

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Copenhagen Metro Ride Optimizer</h1>
      <div className="space-y-4">
        <Picker
          options={allStations}
          value={origin}
          onChange={setOrigin}
          label="From"
        />
        {origin && <StationInfo station={origin} />}
        <Picker
          options={allStations}
          value={destination}
          onChange={setDestination}
          label="To"
        />
        {destination && <StationInfo station={destination} />}
        <RouteDisplay route={route} />
      </div>
    </div>
  );
};

export default CopenhagenMetroOptimizer;