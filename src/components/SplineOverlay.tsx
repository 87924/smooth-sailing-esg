
import React from 'react';

const SplineOverlay = () => {
  return (
    <div className="fixed bottom-8 left-8 z-50 w-24 h-24">
      <style>
        {`
          .spline-watermark {
            display: none !important;
          }
        `}
      </style>
      <iframe 
        src='https://my.spline.design/logoanimatedcubes-ca83c32c33f159b8d3ef7731e23e8e60/' 
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          transform: 'scale(1.5)',
          transformOrigin: 'bottom left',
          background: 'transparent',
          filter: 'brightness(0)',
          opacity: 0.8
        }}
        title="Logo Animation"
      />
    </div>
  );
};

export default SplineOverlay;
