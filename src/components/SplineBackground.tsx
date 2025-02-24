
import Spline from '@splinetool/react-spline';

const SplineBackground = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <Spline 
        className="w-full h-full"
        scene="https://my.spline.design/lines-294e67bb916766e6fd4581bdba8f19ea/"
      />
    </div>
  );
};

export default SplineBackground;
