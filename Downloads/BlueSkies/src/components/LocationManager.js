import React, { useState, useEffect } from "react";

function LocationManager({ onLocationSelect, currentCity }) {
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("weatherFavorites") || "[]");
    setFavorites(savedFavorites);
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          onLocationSelect(`${latitude},${longitude}`);
        },
        (error) => {
          alert("Unable to get your location. Please search manually.");
        }
      );
    }
  };

  const addToFavorites = () => {
    if (currentCity && !favorites.includes(currentCity)) {
      const newFavorites = [...favorites, currentCity];
      setFavorites(newFavorites);
      localStorage.setItem("weatherFavorites", JSON.stringify(newFavorites));
    }
  };

  const removeFavorite = (city) => {
    const newFavorites = favorites.filter(fav => fav !== city);
    setFavorites(newFavorites);
    localStorage.setItem("weatherFavorites", JSON.stringify(newFavorites));
  };

  return (
    <div className="location-manager">
      <div className="location-controls">
        <button onClick={getCurrentLocation} className="location-btn">
          <i className="fas fa-location-arrow"></i>
        </button>
        <button onClick={addToFavorites} className="favorite-btn" disabled={!currentCity}>
          <i className="fas fa-heart"></i>
        </button>
        <button onClick={() => setShowFavorites(!showFavorites)} className="favorites-toggle">
          <i className="fas fa-star"></i> ({favorites.length})
        </button>
      </div>
      
      {showFavorites && (
        <div className="favorites-list">
          {favorites.map((city, index) => (
            <div key={index} className="favorite-item">
              <span onClick={() => onLocationSelect(city)}>{city}</span>
              <button onClick={() => removeFavorite(city)}>×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LocationManager;