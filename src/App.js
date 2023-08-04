import { useState, useEffect } from 'react';
import './App.css';

import {getWeather} from "./weather";
import {fishing_forecast} from "./FishFormula";

function App() {
    const [location, setLocation] = useState(null);
    const [temperature, setTemperature] = useState(null);
    const [description, setDescription] = useState(null);
    const [forecast, setForecast] = useState(null);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;



            getWeather(lat, lon)
                .then((weather) => {
                    if (weather) {
                        setLocation(weather.location);
                        setTemperature(weather.temperature);
                        setDescription(weather.description);
                    }
                });

            fishing_forecast()
                .then(percentage => setForecast(percentage))
                .catch(error => console.error('Error fetching forecast:', error));


        });
    }, []);


    return (
        <div className="container">
            <header className="header">
                <h1 className="headerText">Fishing Forecast</h1>
            </header>

            <div className="locationContainer">

                {location ? (
                    <p className="locationText">Location: {location}</p>
                ) : (
                    <p className="locationText">No location available</p>
                )}
            </div>

            <div className="weatherContainer">

                <p className="tempText">Temperature: {temperature}</p>
            </div>

            <div className="weatherContainer">

                <p className="weatherText">Weather: {description}</p>
            </div>

            <div className="weatherContainer">

                <p className="weatherText">Current chance of bite: {forecast}%</p>
            </div>

            <div className="fish-chance-box">
                <div className="header">Fishing Forecast</div>
                <div className="percentage-display">
                    {forecast}%
                </div>
                <div className="footer">Chance of Catching Fish</div>
            </div>

            <footer className="footer">
                <p className="footerText">Made by Jack Sinclair</p>
            </footer>
        </div>
    );

}

export default App;
