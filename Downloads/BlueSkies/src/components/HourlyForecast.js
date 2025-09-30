import React, { useState, useEffect } from "react";
import axios from "axios";

function HourlyForecast({ city, isCelsius }) {
  const [hourlyData, setHourlyData] = useState([]);
  const [showHourly, setShowHourly] = useState(false);

  useEffect(() => {
    if (city && showHourly) {
      fetchHourlyData();
    }
  }, [city, showHourly]);

  const fetchHourlyData = async () => {
    try {
      const apiKey = "b03a640e5ef6980o4da35b006t5f2942";
      const url = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;
      const response = await axios.get(url);
      
      // Simulate hourly data from daily data
      const hourly = [];
      const now = new Date();
      for (let i = 0; i < 24; i++) {
        const hour = new Date(now.getTime() + i * 60 * 60 * 1000);
        hourly.push({
          time: hour.getHours(),
          temp: Math.round(response.data.daily[0].temperature.maximum - Math.random() * 10),
          icon: response.data.daily[0].condition.icon_url,
          description: response.data.daily[0].condition.description
        });
      }
      setHourlyData(hourly.slice(0, 12));
    } catch (error) {
      console.log("Error fetching hourly data:", error);
    }
  };

  const convertToFahrenheit = (celsius) => {
    return Math.round((celsius * 9) / 5 + 32);
  };

  const renderTemperature = (temp) => {
    return isCelsius ? temp : convertToFahrenheit(temp);
  };

  return (
    <div className="hourly-forecast">
      <button 
        onClick={() => setShowHourly(!showHourly)} 
        className="hourly-toggle"
      >
        {showHourly ? "Hide" : "Show"} Hourly Forecast
      </button>
      
      {showHourly && (
        <div className="hourly-container">
          {hourlyData.map((hour, index) => (
            <div key={index} className="hour-item">
              <div className="hour-time">{hour.time}:00</div>
              <img src={hour.icon} alt={hour.description} className="hour-icon" />
              <div className="hour-temp">{renderTemperature(hour.temp)}°{isCelsius ? 'C' : 'F'}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HourlyForecast;