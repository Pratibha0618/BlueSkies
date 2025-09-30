import React from "react";

function WeatherEffects({ weatherCondition }) {
  const renderEffect = () => {
    const condition = weatherCondition?.toLowerCase() || "";
    
    if (condition.includes("rain")) {
      return (
        <div className="rain-effect">
          {[...Array(50)].map((_, i) => (
            <div key={i} className="raindrop" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${0.5 + Math.random() * 0.5}s`
            }}></div>
          ))}
        </div>
      );
    }
    
    if (condition.includes("snow")) {
      return (
        <div className="snow-effect">
          {[...Array(30)].map((_, i) => (
            <div key={i} className="snowflake" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}>❄</div>
          ))}
        </div>
      );
    }
    
    if (condition.includes("cloud")) {
      return (
        <div className="cloud-effect">
          {[...Array(3)].map((_, i) => (
            <div key={i} className={`cloud cloud-${i + 1}`}>☁</div>
          ))}
        </div>
      );
    }
    
    return null;
  };

  return <div className="weather-effects">{renderEffect()}</div>;
}

export default WeatherEffects;