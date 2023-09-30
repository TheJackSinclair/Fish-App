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