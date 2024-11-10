"use client";

import React, { useState, useEffect } from 'react';
import { stations } from './data/stations';
import { findBestRoute } from './utils/routeFinding';
import { StationPicker } from './components/StationPicker';
import { StationInfo } from './components/StationInfo';
import { RouteDisplay } from './components/RouteDisplay';
import './styles/picker.css';
import './styles/app.css';


const CopenhagenMetroOptimizer: React.FC = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [route, setRoute] = useState<string | string[]>('Where are you and where are you going?');
  const [originPickerOpen, setOriginPickerOpen] = useState(false);
  const [destinationPickerOpen, setDestinationPickerOpen] = useState(false);

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

  useEffect(() => {
    if (originPickerOpen || destinationPickerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [originPickerOpen, destinationPickerOpen]);

  return (
    <div className="app-container">
      <div className="app-content">
        <h1 className="app-title">Copenhagen Metro Ride Optimizer</h1>
        
        <div className="pickers-container">
          <div>
            <StationPicker
              options={allStations}
              value={origin}
              onChange={setOrigin}
              label="From"
              isOpen={originPickerOpen}
              onToggle={() => {
                setOriginPickerOpen(!originPickerOpen);
                setDestinationPickerOpen(false);
              }}
            />
            {origin && <StationInfo station={origin} />}
          </div>
          
          <div>
            <StationPicker
              options={allStations}
              value={destination}
              onChange={setDestination}
              label="To"
              isOpen={destinationPickerOpen}
              onToggle={() => {
                setDestinationPickerOpen(!destinationPickerOpen);
                setOriginPickerOpen(false);
              }}
            />
            {destination && <StationInfo station={destination} />}
          </div>
        </div>
        
        <RouteDisplay route={route} />
      </div>
    </div>
  );
};

export default CopenhagenMetroOptimizer;