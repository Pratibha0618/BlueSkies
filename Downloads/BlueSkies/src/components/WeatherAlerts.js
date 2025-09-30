import React from "react";

function WeatherAlerts({ weather }) {
  const getWeatherAlerts = (data) => {
    const alerts = [];
    const temp = data.temperature?.current;
    const humidity = data.temperature?.humidity;
    const windSpeed = data.wind?.speed;

    if (temp > 35) alerts.push({ type: "heat", message: "Extreme heat warning!" });
    if (temp < 0) alerts.push({ type: "cold", message: "Freezing temperature alert!" });
    if (humidity > 80) alerts.push({ type: "humidity", message: "High humidity levels!" });
    if (windSpeed > 15) alerts.push({ type: "wind", message: "Strong wind advisory!" });

    return alerts;
  };

  if (!weather.data || !weather.data.temperature) return null;

  const alerts = getWeatherAlerts(weather.data);

  if (alerts.length === 0) return null;

  return (
    <div className="weather-alerts">
      {alerts.map((alert, index) => (
        <div key={index} className={`alert alert-${alert.type}`}>
          <i className="fas fa-exclamation-triangle"></i>
          {alert.message}
        </div>
      ))}
    </div>
  );
}

export default WeatherAlerts;