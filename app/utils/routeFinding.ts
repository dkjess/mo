import { stations, lines } from '../data/stations';

interface PathResult {
  distance: number;
  instruction: string;
}

const getPositionForM3 = (start: string, end: string): string => {
  const m3Stations = lines.M3.map(s => s.name);
  const startIndex = m3Stations.indexOf(start);
  const endIndex = m3Stations.indexOf(end);
  const totalStations = m3Stations.length;
  
  // Calculate both possible distances
  let forwardDistance = endIndex - startIndex;
  if (forwardDistance < 0) forwardDistance += totalStations;
  
  let backwardDistance = startIndex - endIndex;
  if (backwardDistance < 0) backwardDistance += totalStations;
  
  // Use the shorter distance to determine direction
  const movingForward = forwardDistance <= backwardDistance;
  
  // If we're moving forward and destination has layout B, we want back of train
  // If we're moving backward and destination has layout A, we want back of train
  if (movingForward) {
    return stations[end].layout === 'B' ? 'back' : 'front';
  } else {
    return stations[end].layout === 'B' ? 'front' : 'back';
  }
};

const getPosition = (start: string, end: string, line: string): string => {
  // Special handling for M3 line
  if (line === 'M3') {
    return getPositionForM3(start, end);
  }
  
  // Regular handling for other lines
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

const getDistance = (start: string, end: string, line: string): number => {
  const lineStations = lines[line].map(s => s.name);
  const startIndex = lineStations.indexOf(start);
  const endIndex = lineStations.indexOf(end);
  
  if (line === 'M3') {
    const totalStations = lineStations.length;
    let forwardDistance = endIndex - startIndex;
    if (forwardDistance < 0) forwardDistance += totalStations;
    
    let backwardDistance = startIndex - endIndex;
    if (backwardDistance < 0) backwardDistance += totalStations;
    
    return Math.min(forwardDistance, backwardDistance);
  }
  
  return Math.abs(endIndex - startIndex);
};

const createInstruction = (line: string, station: string, position: string): string => {
  return `${line} ${position === 'front' ? '→' : '←'} ${station}`;
};

const findShortestPath = (start: string, end: string): PathResult | null => {
  const commonLines = stations[start].lines.filter(line => stations[end].lines.includes(line));
  
  if (commonLines.length === 0) return null;

  let shortestPath: PathResult | null = null;
  let shortestDistance = Infinity;

  commonLines.forEach(line => {
    const distance = getDistance(start, end, line);
    if (distance < shortestDistance) {
      shortestDistance = distance;
      const position = getPosition(start, end, line);
      shortestPath = {
        distance,
        instruction: createInstruction(line, end, position)
      };
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