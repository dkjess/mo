export interface Station {
    name: string;
    layout: 'A' | 'B';
  }
  
  export interface StationType {
    layout: 'A' | 'B';
    lines: string[];
  }
  
  export interface StationsMap {
    [key: string]: StationType;
  }
  
  export interface LineColors {
    bg: string;
    text: string;
  }
  
  export interface LineColorMap {
    [key: string]: LineColors;
  }
  
  export const lineColors: LineColorMap = {
    M1: { bg: '#009E49', text: 'white' },
    M2: { bg: '#FECA0A', text: 'black' },
    M3: { bg: '#EE1C25', text: 'white' },
    M4: { bg: '#0090D0', text: 'white' }
  };
  
  export const lines: { [key: string]: Station[] } = {
    M1: [
      { name: 'Vanløse', layout: 'A' },
      { name: 'Flintholm', layout: 'A' },
      { name: 'Lindevang', layout: 'B' },
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
      { name: 'Flintholm', layout: 'A' },
      { name: 'Lindevang', layout: 'B' },
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
      { name: 'Rådhuspladsen', layout: 'A' },
      { name: 'Gammel Strand', layout: 'A' },
      { name: 'Kongens Nytorv', layout: 'A' },
      { name: 'Marmorkirken', layout: 'B' },
      { name: 'Østerport', layout: 'B' },
      { name: 'Trianglen', layout: 'B' },
      { name: 'Poul Henningsens Plads', layout: 'B' },
      { name: 'Vibenshus Runddel', layout: 'B' },
      { name: 'Skjolds Plads', layout: 'A' },
      { name: 'Nørrebro', layout: 'B' },
      { name: 'Nørrebros Runddel', layout: 'B' },
      { name: 'Nuuks Plads', layout: 'B' },
      { name: 'Aksel Møllers Have', layout: 'B' },
      { name: 'Frederiksberg', layout: 'A' },
      { name: 'Frederiksberg Allé', layout: 'B' },
      { name: 'Enghave Plads', layout: 'A' }
    ],
    M4: [
      { name: 'Orientkaj', layout: 'B' },
      { name: 'Nordhavn', layout: 'A' },
      { name: 'Østerport', layout: 'B' },
      { name: 'Marmorkirken', layout: 'A' },
      { name: 'Kongens Nytorv', layout: 'B' },
      { name: 'Gammel Strand', layout: 'A' },
      { name: 'Rådhuspladsen', layout: 'B' },
      { name: 'Københavns Hovedbanegård', layout: 'A' },
      { name: 'Havneholmen', layout: 'B' },
      { name: 'Enghave Brygge', layout: 'A' },
      { name: 'Sluseholmen', layout: 'B' },
      { name: 'Mozarts Plads', layout: 'A' },
      { name: 'København Syd', layout: 'B' }
    ]
  };
  
  // Create stations object
  export const stations: StationsMap = Object.values(lines).flat().reduce((acc: StationsMap, station) => {
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