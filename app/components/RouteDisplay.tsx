interface RouteDisplayProps {
  route: string | string[];
}

export const RouteDisplay: React.FC<RouteDisplayProps> = ({ route }) => {
  const renderInstruction = (instruction: string) => {
    const [line, arrow, ...stationParts] = instruction.split(' ');
    const station = stationParts.join(' ');
    
    return (
      <div className="flex items-center space-x-4 p-6 bg-white rounded-lg shadow-sm">
        <div className={`
          flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl text-white
          ${line === 'M1' ? 'bg-[#009E49]' : ''}
          ${line === 'M2' ? 'bg-[#FECA0A] text-black' : ''}
          ${line === 'M3' ? 'bg-[#EE1C25]' : ''}
          ${line === 'M4' ? 'bg-[#0090D0]' : ''}
        `}>
          {line}
        </div>
        <div className="text-4xl font-light w-16 text-center">
          {arrow === '➡️' ? '→' : '←'}
        </div>
        <div className="text-2xl font-medium text-gray-700">
          {station}
        </div>
      </div>
    );
  };

  if (typeof route === 'string') {
    return (
      <div className="text-xl text-center text-gray-500 p-6">
        {route}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {route.map((instruction, index) => (
        <div key={index}>
          {renderInstruction(instruction)}
        </div>
      ))}
    </div>
  );
};