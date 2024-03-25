import { useState, useEffect } from "react";
import "./App.css";
import { getWeather } from "./weather";
import { fishing_forecast } from "./FishFormula";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFishFins,
  faMapLocation,
  faTemperature3,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { Analytics } from "@vercel/analytics/react";

function App() {
  const [location, setLocation] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [description, setDescription] = useState(null);
  const [forecast, setForecast] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      getWeather(lat, lon).then((weather) => {
        if (weather) {
          setLocation(weather.location);
          setTemperature(weather.temperature);
          setDescription(weather.description);
        }
      });
    });
  }, []);

  const handleSelectChange = (event) => {
    fishing_forecast(event.target.value)
      .then((percentage) => setForecast(percentage))
      .catch((error) => console.error("Error fetching forecast:", error));
  };

  return (
    <div className="container">
      <header className="header">
        <h1 className="headerText">
          <FontAwesomeIcon icon={faFishFins} /> Fishing Forecast
        </h1>
      </header>

      <div className="dropDownContainer">
        <p className="dropDownText">Select Fish Type:</p>
        <select onChange={handleSelectChange} className={"dropDown"}>
          <option hidden disabled selected value></option>
          <option value={"mackerel"}>Mackerel</option>
          <option value={"cod"}>Cod</option>
          <option value={"haddock"}>Haddock</option>
          <option value={"bass"}>Bass</option>
          <option value={"trout"}>Trout</option>
        </select>
      </div>

      <div className="locationContainer">
        {location ? (
          <p className="locationText">
            <FontAwesomeIcon icon={faMapLocation} /> Location: {location}
          </p>
        ) : (
          <p className="locationText">No location available</p>
        )}
      </div>

      <div className="tempContainer">
        <p className="tempText">
          <FontAwesomeIcon icon={faTemperature3} /> Temperature: {temperature}
        </p>
      </div>

      <div className="weatherContainer">
        <p className="weatherText">Weather: {description}</p>
      </div>

      {forecast !== null ? (
        <motion.div
          className="fish-chance-box"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 10,
            duration: 2,
          }}
        >
          <motion.div
            className="header"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{
              delay: 1,
              type: "spring",
              stiffness: 100,
            }}
          >
            Chance of a Bite
          </motion.div>
          <motion.div
            className="percentage-display"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{
              delay: 1,
              type: "spring",
              stiffness: 100,
            }}
          >
            {Math.round(forecast)}%
          </motion.div>
        </motion.div>
      ) : (
        <div className="loading-bar-container">
          <div className="loading-bar"></div>
        </div>
      )}

      <footer className="footer">
        <p className="footerSubText">
          * This percentage is a rough indicator. Conditions such as local
          population, noise, vibration and your own skill are not taken into
          account *
        </p>
        <p className="footerText">Developed by Jack Sinclair</p>
      </footer>
      <Analytics />
    </div>
  );
}

export default App;
