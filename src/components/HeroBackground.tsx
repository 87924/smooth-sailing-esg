
import React from 'react';

const HeroBackground = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <style>
        {`
          .spline-watermark {
            display: none !important;
          }
        `}
      </style>
      <iframe 
        src='https://my.spline.design/lines-294e67bb916766e6fd4581bdba8f19ea/' 
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          position: 'absolute',
          pointerEvents: 'none'
        }}
        title="Background Animation"
      />
    </div>
  );
};

export default HeroBackground;
