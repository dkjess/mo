import { stations, lines } from '../data/stations';

interface PathResult {
  distance: number;
  instruction: string;
}

const getPosition = (start: string, end: string, line: string): string => {
  const lineStations = lines[line].map(s => s.name);
  const startIndex = lineStations.indexOf(start);
  const endIndex = lineStations.indexOf(end);
  
  const movingForward = startIndex < endIndex;

  if (movingForward) {
    return stations[end].layout === 'B' ? 'back' : 'front';
  } else {
    return stations[end].layout === 'B' ? 'front' : 'back';
  }
};

// Simplified to just create the instruction string
const createInstruction = (line: string, station: string, position: string): string => {
  // Let's add a console.log to debug
  console.log(`Creating instruction for ${line} to ${station}, position: ${position}`);
  return `${line} ${position === 'front' ? '→' : '←'} ${station}`;
};

const findShortestPath = (start: string, end: string): PathResult | null => {
  const commonLines = stations[start].lines.filter(line => stations[end].lines.includes(line));
  
  if (commonLines.length === 0) return null;

  let shortestPath: PathResult | null = null;
  let shortestDistance = Infinity;

  commonLines.forEach(line => {
    const lineStations = lines[line].map(s => s.name);
    const startIndex = lineStations.indexOf(start);
    const endIndex = lineStations.indexOf(end);
    
    if (startIndex !== -1 && endIndex !== -1) {
      const distance = Math.abs(endIndex - startIndex);
      if (distance < shortestDistance) {
        shortestDistance = distance;
        const position = getPosition(start, end, line);
        shortestPath = {
          distance,
          instruction: createInstruction(line, end, position)
        };
      }
    }
  });

  return shortestPath;
};

export const findBestRoute = (start: string, end: string): string[] => {
  if (!stations[start] || !stations[end]) {
    return ['Invalid station selection'];
  }

  const startStation = stations[start];
  const endStation = stations[end];

  // Check for direct route
  const directLine = startStation.lines.find(line => endStation.lines.includes(line));
  if (directLine) {
    const position = getPosition(start, end, directLine);
    return [createInstruction(directLine, end, position)];
  }

  // Find transfer route
  const transferStations = Object.keys(stations).filter(station => 
    station !== start && 
    station !== end &&
    stations[station].lines.some(line => startStation.lines.includes(line)) &&
    stations[station].lines.some(line => endStation.lines.includes(line))
  );

  let bestRoute: string[] | null = null;
  let shortestDistance = Infinity;

  transferStations.forEach(transferStation => {
    const firstLeg = findShortestPath(start, transferStation);
    const secondLeg = findShortestPath(transferStation, end);
    
    if (firstLeg && secondLeg) {
      const totalDistance = firstLeg.distance + secondLeg.distance;
      if (totalDistance < shortestDistance) {
        shortestDistance = totalDistance;
        bestRoute = [firstLeg.instruction, secondLeg.instruction];
      }
    }
  });

  return bestRoute || ['No suitable route found'];
};