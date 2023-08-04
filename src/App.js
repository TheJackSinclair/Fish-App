import { useState, useEffect } from 'react';
import './App.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {getWeather, getTemperatureIcon} from "./weather";

function App() {
    const [location, setLocation] = useState(null);
    const [temperature, setTemperature] = useState(null);
    const [description, setDescription] = useState(null);

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

        });
    }, []);


    return (
        <div className="container">
            <header className="header">
                <h1 className="headerText">Fishing Forecast</h1>
            </header>

            <div className="locationContainer">
                <FontAwesomeIcon name="map-marker" size={'sm'} color="#000"/>
                {location ? (
                    <p className="locationText">Location: {location}</p>
                ) : (
                    <p className="locationText">No location available</p>
                )}
            </div>

            <div className="weatherContainer">
                <FontAwesomeIcon name={getTemperatureIcon(temperature)} size={'sm'} color="#f0c30f"/>
                <p className="tempText">Temperature: {temperature}</p>
            </div>

            <div className="weatherContainer">
                <FontAwesomeIcon name="sun-o" size={'sm'} color="#f0c30f"/>
                <p className="weatherText">Weather: {description}</p>
            </div>

            <footer className="footer">
                <p className="footerText">Made by Jack Sinclair</p>
            </footer>
        </div>
    );

}

export default App;
