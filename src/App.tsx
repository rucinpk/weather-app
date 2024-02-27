import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

interface Weather {
  location: {
    name: string;
  };
  current: {
    temp_c: number;
    condition: {
      text: string;
      icon: string;
    };
    wind_kph: number;
    humidity: number;
  };
}

interface FetchError {
  message: string;
}

function App() {
  const [apiKey, setApiKey] = useState("");
  const [weather, setWeather] = useState<Weather | null>(null);
  const [error, setError] = useState<FetchError | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const fetchWeather = async () => {
    setError(null);
    setWeather(null);
    const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=Warsaw&aqi=no`;
    try {
      const response = await axios.get(url);
      setWeather(response.data);
    } catch (err) {
      setError({ message: "Failed to fetch weather data. Please try again." });
    }
  };

  useEffect(() => {
    if (apiKey && isSubmitted) {
      fetchWeather();
    }
  }, [apiKey, isSubmitted]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleRetry = () => {
    setIsSubmitted(false);
    setError(null);
    setWeather(null);
  };

  return (
    <div className="App">
      <main className="app-content">
        {(!isSubmitted || error) && (
          <>
            <form onSubmit={handleSubmit} className="api-key-form">
              <label htmlFor="apiKeyInput" className="api-key-label">
                Enter your{" "}
                <a
                  className="weather-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.weatherapi.com/my/"
                >
                  WeatherAPI
                </a>{" "}
                Key:
              </label>
              <input
                id="apiKeyInput"
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="api-key-input"
                placeholder="Your API Key..."
                required
              />
              <button type="submit" className="submit-btn">
                See Weather
              </button>
            </form>
            {error && (
              <div>
                <p>Error: {error.message}</p>
                <button onClick={handleRetry} className="submit-btn">
                  Retry With New Key
                </button>
              </div>
            )}
          </>
        )}
        {weather && (
          <div>
            <h2>{weather.location.name} Weather</h2>
            <img src={weather.current.condition.icon} alt="Weather icon" />
            <p>{weather.current.temp_c} °C</p>
            <p>{weather.current.condition.text}</p>
            <p>Wind Speed: {weather.current.wind_kph} kph</p>
            <p>Humidity: {weather.current.humidity}%</p>
            <button onClick={handleRetry} className="submit-btn">
              Retry
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

//8eee8de9692546ff800202940242702
