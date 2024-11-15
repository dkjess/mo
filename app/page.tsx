"use client";

import React, { useState, useEffect } from 'react';
import { stations } from './data/stations';
import { findBestRoute } from './utils/routeFinding';
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
    <div className="p-0 max-w-4xl mx-auto">      
      <div className="grid grid-cols-2 gap-0 mb-6">
        <div>
          <div className="h-[60vh] overflow-y-auto bg-white">
            {allStations.map((station) => (
              <div 
                key={station} 
                className={`px-4 py-3 cursor-pointer hover:bg-gray-100 ${
                  origin === station ? 'bg-blue-50' : ''
                }`}
                onClick={() => setOrigin(station)}
              >
                <div className={origin === station ? 'text-blue-600 font-semibold' : ''}>
                  {station}
                </div>
                <div className="mt-1">
                  {origin === station && (
                    <div className="flex gap-1">
                      {stations[station].lines.map(line => (
                        <span
                          key={line}
                          className={`inline-flex px-2 py-0.5 rounded-full text-sm font-medium
                            ${line === 'M1' ? 'bg-[#009E49] text-white' : ''}
                            ${line === 'M2' ? 'bg-[#FECA0A] text-black' : ''}
                            ${line === 'M3' ? 'bg-[#EE1C25] text-white' : ''}
                            ${line === 'M4' ? 'bg-[#0090D0] text-white' : ''}
                          `}
                        >
                          {line}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="h-[59vh] overflow-y-auto bg-white">
            {allStations.map((station) => (
              <div 
                key={station} 
                className={`px-4 py-3 cursor-pointer hover:bg-gray-100 ${
                  destination === station ? 'bg-blue-50' : ''
                }`}
                onClick={() => setDestination(station)}
              >
                <div className={destination === station ? 'text-blue-600 font-semibold' : ''}>
                  {station}
                </div>
                <div className="mt-1">
                  {destination === station && (
                    <div className="flex gap-1">
                      {stations[station].lines.map(line => (
                        <span
                          key={line}
                          className={`inline-flex px-2 py-0.5 rounded-full text-sm font-medium
                            ${line === 'M1' ? 'bg-[#009E49] text-white' : ''}
                            ${line === 'M2' ? 'bg-[#FECA0A] text-black' : ''}
                            ${line === 'M3' ? 'bg-[#EE1C25] text-white' : ''}
                            ${line === 'M4' ? 'bg-[#0090D0] text-white' : ''}
                          `}
                        >
                          {line}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
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