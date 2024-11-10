"use client";

import React, { useState, useEffect, useRef } from 'react';
import BScroll from '@better-scroll/core';
import Wheel from '@better-scroll/wheel';

// Initialize BScroll with Wheel plugin outside of component
if (typeof window !== 'undefined') {
  BScroll.use(Wheel);
}

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scroll, setScroll] = useState<any>(null);
  const currentIndex = options.indexOf(value) >= 0 ? options.indexOf(value) : 0;

  useEffect(() => {
    if (isOpen && scrollRef.current && !scroll) {
      const bs = new BScroll(scrollRef.current, {
        wheel: {
          selectedIndex: currentIndex,
          rotate: 25,
          adjustTime: 400,
          wheelWrapperClass: 'wheel-scroll',
          wheelItemClass: 'wheel-item',
        },
        probeType: 3
      });

      bs.on('wheelIndexChanged', (index: number) => {
        const selected = options[index];
        if (selected) {
          onChange(selected);
        }
      });

      setScroll(bs);
    }

    return () => {
      if (scroll) {
        scroll.destroy();
        setScroll(null);
      }
    };
  }, [isOpen, options, currentIndex, onChange, scroll]);

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
            
            <div className="relative h-[200px] overflow-hidden">
              <div className="absolute left-0 right-0 top-[50%] transform -translate-y-[50%] h-[40px] border-t border-b border-gray-200 pointer-events-none" />
              
              <div ref={scrollRef} className="h-full">
                <div className="wheel-scroll">
                  <div className="wheel-item h-[80px]" />
                  <div className="wheel-item h-[80px]" />
                  
                  {options.map((option) => (
                    <div 
                      key={option} 
                      className="wheel-item h-[40px] flex items-center justify-center text-base"
                    >
                      {option}
                    </div>
                  ))}
                  
                  <div className="wheel-item h-[80px]" />
                  <div className="wheel-item h-[80px]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};