interface RouteDisplayProps {
  route: string | string[];
}

export const RouteDisplay: React.FC<RouteDisplayProps> = ({ route }) => {
  const renderInstruction = (instruction: string) => {
    const [line, arrowStr, ...stationParts] = instruction.split(' ');
    const station = stationParts.join(' ');
    
    return (
      <div className="flex items-center p-4">
        <div className={`
          flex-shrink-0 w-[34px] h-[34px] rounded-full flex items-center justify-center font-medium text-[15px]
          ${line === 'M1' ? 'bg-[#009E49] text-white' : ''}
          ${line === 'M2' ? 'bg-[#FECA0A] text-black' : ''}
          ${line === 'M3' ? 'bg-[#EE1C25] text-white' : ''}
          ${line === 'M4' ? 'bg-[#0090D0] text-white' : ''}
        `}>
          {line}
        </div>
        <div className="text-2xl w-12 text-center text-gray-900 dark:text-gray-100">
          {arrowStr}
        </div>
        <div className="text-[17px] leading-[22px] text-gray-900 dark:text-gray-100 font-medium">
          {station}
        </div>
      </div>
    );
  };

  if (typeof route === 'string') {
    return (
      <div className="p-4 text-[15px] leading-[20px] text-gray-500 dark:text-gray-400">
        {route}
      </div>
    );
  }

  return (
    <div>
      {route.map((instruction, index) => (
        <div key={index}>
          {renderInstruction(instruction)}
        </div>
      ))}
    </div>
  );
};