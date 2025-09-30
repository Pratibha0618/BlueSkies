import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchEngine from "./SearchEngine";
import Forecast from "./Forecast";
import LocationManager from "./LocationManager";
import HourlyForecast from "./HourlyForecast";
import WeatherAlerts from "./WeatherAlerts";
import WeatherEffects from "./WeatherEffects";
import Weather3D from "./Weather3D";

import "../styles.css";
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState({
    loading: true,
    data: {},
    error: false
  });
  const [viewMode, setViewMode] = useState("current"); // current, hourly, map
  const [isCelsius, setIsCelsius] = useState(true); // Global temperature unit state
  const [isPolling, setIsPolling] = useState(true); // API polling state

  const getWeatherTheme = (weatherData) => {
    if (!weatherData || !weatherData.condition) return "default";
    
    const condition = weatherData.condition.description.toLowerCase();
    const temp = weatherData.temperature.current;
    
    if (condition.includes("rain") || condition.includes("drizzle")) return "rainy";
    if (condition.includes("snow") || condition.includes("blizzard")) return "snowy";
    if (condition.includes("cloud") || condition.includes("overcast")) return "cloudy";
    if (condition.includes("clear") || condition.includes("sunny")) {
      return temp > 25 ? "sunny-hot" : "sunny-cool";
    }
    if (condition.includes("fog") || condition.includes("mist")) return "foggy";
    if (condition.includes("thunder") || condition.includes("storm")) return "stormy";
    
    return "default";
  };

  const toDate = () => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ];

    const currentDate = new Date();
    const date = `${days[currentDate.getDay()]} ${currentDate.getDate()} ${months[currentDate.getMonth()]
      }`;
    return date;
  };
  const search = async (event) => {
    event.preventDefault();
    if (event.type === "click" || (event.type === "keypress" && event.key === "Enter")) {
      performSearch(query);
    }
  };

  const performSearch = async (searchQuery) => {
    setWeather({ ...weather, loading: true });
    const apiKey = "b03a640e5ef6980o4da35b006t5f2942";
    const url = `https://api.shecodes.io/weather/v1/current?query=${searchQuery}&key=${apiKey}`;

    try {
      const res = await axios.get(url);
      setWeather({ data: res.data, loading: false, error: false });
    } catch (error) {
      setWeather({ ...weather, data: {}, error: true });
      console.log("error", error);
    }
  };

  const handleLocationSelect = (location) => {
    setQuery(location);
    performSearch(location);
  };

  useEffect(() => {
    const fetchData = async () => {
      const apiKey = "b03a640e5ef6980o4da35b006t5f2942";
      const url = `https://api.shecodes.io/weather/v1/current?query=Rabat&key=${apiKey}`;

      try {
        const response = await axios.get(url);
        setWeather({ data: response.data, loading: false, error: false });
      } catch (error) {
        setWeather({ data: {}, loading: false, error: true });
        console.log("error", error);
      }
    };

    fetchData();
  }, []);

  // API Polling Effect
  useEffect(() => {
    if (!isPolling || !weather.data.city) return;

    const interval = setInterval(() => {
      performSearch(weather.data.city);
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, [isPolling, weather.data.city]);

  const weatherTheme = getWeatherTheme(weather.data);

  return (
    <div className={`App theme-${weatherTheme}`}>
      <WeatherEffects weatherCondition={weather.data?.condition?.description} />
      <SearchEngine query={query} setQuery={setQuery} search={search} />
      
      <LocationManager 
        onLocationSelect={handleLocationSelect}
        currentCity={weather.data?.city}
      />

      <div className="controls-container">
        <div className="view-controls">
          <button 
            className={viewMode === "current" ? "active" : ""}
            onClick={() => setViewMode("current")}
          >
            Current
          </button>
          <button 
            className={viewMode === "hourly" ? "active" : ""}
            onClick={() => setViewMode("hourly")}
          >
            Hourly
          </button>
        </div>
        
        <div className="temp-toggle">
          <button 
            className={`temp-unit-btn ${isCelsius ? 'active' : ''}`}
            onClick={() => setIsCelsius(true)}
          >
            °C
          </button>
          <button 
            className={`temp-unit-btn ${!isCelsius ? 'active' : ''}`}
            onClick={() => setIsCelsius(false)}
          >
            °F
          </button>
        </div>
        
        <div className="polling-toggle">
          <button 
            className={`polling-btn ${isPolling ? 'active' : ''}`}
            onClick={() => setIsPolling(!isPolling)}
            title={isPolling ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
          >
            <i className={`fas fa-${isPolling ? 'pause' : 'play'}`}></i>
          </button>
        </div>
      </div>

      {weather.loading && (
        <>
          <br />
          <h4>Searching..</h4>
        </>
      )}

      {weather.error && (
        <>
          <br />
          <span className="error-message">
            Sorry city not found, please try again.
          </span>
        </>
      )}

      {weather && weather.data && weather.data.condition && (
        <>
          <WeatherAlerts weather={weather} />
          
          {viewMode === "current" && (
            <>
              <Weather3D 
                weather={weather.data.condition?.description}
                temperature={weather.data.temperature?.current}
              />
              <Forecast weather={weather} toDate={toDate} isCelsius={isCelsius} />
            </>
          )}
          
          {viewMode === "hourly" && (
            <HourlyForecast city={weather.data.city} isCelsius={isCelsius} />
          )}
        </>
      )}
    </div>
  );
}

export default App;
