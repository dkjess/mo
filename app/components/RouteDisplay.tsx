import React from 'react';

interface RouteDisplayProps {
  route: string | string[];
}

export const RouteDisplay: React.FC<RouteDisplayProps> = ({ route }) => {
  if (typeof route === 'string') {
    return <pre className="mt-4 p-2 bg-gray-100 rounded whitespace-pre-wrap text-sm">{route}</pre>;
  }

  return (
    <div className="mt-4 p-2 bg-gray-100 rounded text-sm">
      {route.map((step, index) => (
        <p key={index} className="mb-2">{step}</p>
      ))}
    </div>
  );
};