import { stations, lines } from '../data/stations';

interface PathResult {
  distance: number;
  instruction: string;
}

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

export const findShortestPath = (start: string, end: string): PathResult | null => {
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

export const findBestRoute = (start: string, end: string): string[] => {
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