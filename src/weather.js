// weather.js
import axios from 'axios';

export const getWeather = (lat, lon) => {
    const API_KEY = '211f1a1ffd69b587bde82333d98cb151';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    return axios.get(url)
        .then((response) => {
            const { data } = response;
            const location = `${data.name}, ${data.sys.country}`;
            const temperature = Math.round(data.main.temp); // Rounded to the nearest degree
            const description = data.weather[0].main
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' '); // Capitalized

            return { location, temperature: `${temperature} °C`, description };
        })
        .catch((error) => {
            console.error(error);
            return null;
        });
};

export const getTemperatureIcon = (temperature) => {
    if (temperature <= 0) {
        return "fas fa-temperature-low"; // Icon for freezing temperature
    } else if (temperature > 0 && temperature < 20) {
        return "fas fa-thermometer-half"; // Icon for cold temperature
    } else if (temperature >= 20 && temperature < 30) {
        return "fas fa-thermometer-three-quarters"; // Icon for warm temperature
    } else {
        return "fas fa-temperature-high"; // Icon for hot temperature
    }
};