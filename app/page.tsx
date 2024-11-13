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
    <div className="p-4 max-w-4xl mx-auto">      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <div className="h-[60vh] border rounded-lg overflow-y-auto bg-white">
            {allStations.map((station) => (
              <div 
                key={station} 
                className={`px-4 py-3 cursor-pointer hover:bg-gray-100 ${
                  origin === station ? 'bg-blue-50 text-blue-600 font-semibold' : ''
                }`}
                onClick={() => setOrigin(station)}
              >
                {station}
                {origin === station && <StationInfo station={station} />}
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="h-[60vh] border rounded-lg overflow-y-auto bg-white">
            {allStations.map((station) => (
              <div 
                key={station} 
                className={`px-4 py-3 cursor-pointer hover:bg-gray-100 ${
                  destination === station ? 'bg-blue-50 text-blue-600 font-semibold' : ''
                }`}
                onClick={() => setDestination(station)}
              >
                {station}
                {destination === station && <StationInfo station={station} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <RouteDisplay route={route} />
      </div>
    </div>
  );
};

export default CopenhagenMetroOptimizer;