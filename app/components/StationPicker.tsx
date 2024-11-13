"use client";

import React from 'react';

interface StationPickerProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  options: string[];
  isOpen: boolean;
  onToggle: () => void;
}

export const StationPicker: React.FC<StationPickerProps> = ({ 
  value, 
  onChange, 
  label, 
  options,
  isOpen,
  onToggle
}) => {
  return (
    <div className="mb-4">
      <div 
        onClick={onToggle}
        className="w-full p-4 bg-white border border-gray-300 rounded-lg shadow-sm cursor-pointer"
      >
        <div className="font-bold text-gray-700 mb-1">{label}</div>
        <div className="text-lg">
          {value || 'Select station'}
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-end">
          <div className="w-full bg-white rounded-t-xl">
            <div className="flex justify-between items-center p-4 border-b">
              <button 
                onClick={onToggle}
                className="text-blue-500 font-semibold"
              >
                Cancel
              </button>
              <div className="font-bold">{label}</div>
              <button 
                onClick={onToggle}
                className="text-blue-500 font-semibold"
              >
                Done
              </button>
            </div>
            
            <div className="h-[300px] overflow-y-auto">
              <div className="py-2">
                {options.map((option) => (
                  <div 
                    key={option} 
                    className={`px-4 py-3 cursor-pointer hover:bg-gray-100 active:bg-gray-200 ${
                      value === option ? 'bg-blue-50 text-blue-600 font-semibold' : ''
                    }`}
                    onClick={() => {
                      onChange(option);
                      onToggle();
                    }}
                  >
                    {option}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};