import React from 'react';

const CustomLoader = ({ size = 'large', message = 'Loading...' }) => {
  const sizeConfig = {
    small: { container: 'w-8 h-8', dot: 'w-1.5 h-1.5' },
    medium: { container: 'w-12 h-12', dot: 'w-2 h-2' },
    large: { container: 'w-16 h-16', dot: 'w-2.5 h-2.5' }
  };

  const config = sizeConfig[size];

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className={`${config.container} relative`}>
        {/* Segmented circular spinner with 8 dots */}
        {[...Array(8)].map((_, index) => {
          const rotation = index * 45; // 360/8 = 45 degrees per dot
          const delay = index * 0.125; // Stagger animation by 125ms
          
          return (
            <div
              key={index}
              className="absolute inset-0 flex items-start justify-center"
              style={{
                transform: `rotate(${rotation}deg)`,
              }}
            >
              <div
                className={`${config.dot} bg-emerald-600 rounded-full`}
                style={{
                  animation: `fade-dot 1s ease-in-out ${delay}s infinite`,
                }}
              />
            </div>
          );
        })}
      </div>
      
      {message && (
        <p className="text-gray-600 font-medium text-sm animate-pulse">{message}</p>
      )}
      
      <style jsx>{`
        @keyframes fade-dot {
          0%, 100% {
            opacity: 0.2;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default CustomLoader;
