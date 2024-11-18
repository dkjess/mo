"use client";

import React, { useState, useEffect } from 'react';
import { stations } from './data/stations';
import { findBestRoute } from './utils/routeFinding';
import { StationInfo } from './components/StationInfo';
import { RouteDisplay } from './components/RouteDisplay';

const CopenhagenMetroOptimizer: React.FC = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [route, setRoute] = useState<string | string[]>('Select your stations from the lists above');

  useEffect(() => {
    if (origin && destination) {
      const bestRoute = findBestRoute(origin, destination);
      setRoute(bestRoute);
    } else if (origin && !destination) {
      setRoute('Select your destination station');
    } else if (!origin && destination) {
      setRoute('Select your starting station');
    } else {
      setRoute('Select your stations from the lists above');
    }
  }, [origin, destination]);

  const allStations = Object.keys(stations).sort();

  return (
    <div className="h-[100dvh] grid grid-rows-[env(safe-area-inset-top)_1fr_auto] font-[-apple-system,BlinkMacSystemFont,system-ui,sans-serif]">
      <div className="bg-gray-50 dark:bg-black" />
      
      <div className="grid grid-cols-2 min-h-0">
        <div className="overflow-y-auto bg-gray-50 dark:bg-black">
          {allStations.map((station) => (
            <div 
              key={station} 
              className={`px-4 py-3 cursor-pointer transition-colors text-[17px] leading-[22px]
                ${origin === station 
                  ? 'bg-gray-100 dark:bg-gray-900 text-black dark:text-white font-semibold' 
                  : 'text-gray-900 dark:text-gray-100 active:bg-gray-100 dark:active:bg-gray-900'}`}
              onClick={() => setOrigin(station)}
            >
              {station}
              {origin === station && <StationInfo station={station} />}
            </div>
          ))}
        </div>

        <div className="overflow-y-auto bg-gray-50 dark:bg-black">
          {allStations.map((station) => (
            <div 
              key={station} 
              className={`px-4 py-3 cursor-pointer transition-colors text-[17px] leading-[22px]
                ${destination === station 
                  ? 'bg-gray-100 dark:bg-gray-900 text-black dark:text-white font-semibold' 
                  : 'text-gray-900 dark:text-gray-100 active:bg-gray-100 dark:active:bg-gray-900'}`}
              onClick={() => setDestination(station)}
            >
              {station}
              {destination === station && <StationInfo station={station} />}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-black border-t border-gray-200 dark:border-gray-800">
        <RouteDisplay route={route} />
        <div className="h-[calc(env(safe-area-inset-bottom)+16px)]" />
      </div>
    </div>
  );
};

export default CopenhagenMetroOptimizer;