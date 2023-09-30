import axios from "axios";


const API_KEY = '211f1a1ffd69b587bde82333d98cb151';

// Define optimal temperatures and seasons for the species you're targeting
const optimal_seasons = ['spring', 'summer'];
const IDEAL_PRESSURE = 1015;

function getWeather() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
                .then(response => {
                    resolve({
                        weathertype: response.data.weather[0].main.toLowerCase(),
                        rain_intensity: response.data.rain ? 'light' : 'none', // You'll need to adjust this logic
                        barometric_pressure: response.data.main.pressure // Interpretation required
                    });
                })
                .catch(error => reject(error)); // Make sure to handle errors
        }, (error) => reject(error)); // Handle geolocation errors
    });
}

function getTimeOfDay() {
    const hour = new Date().getHours();
    if (hour < 6) return 'early_morning';
    if (hour < 10) return 'mid_morning';
    if (hour < 14) return 'early_afternoon';
    return 'late_afternoon';
}

function getSeason() {
    const month = new Date().getMonth();
    if (month < 2 || month === 11) return 'winter';
    if (month < 5) return 'spring';
    if (month < 8) return 'summer';
    return 'fall';
}

function getMoonPhase() {
    const dayOfMoonCycle = (new Date().getTime() / (29.53 * 24 * 60 * 60 * 1000)) % 1 * 29.53;

    if (dayOfMoonCycle < 1.5) return 'new';
    if (dayOfMoonCycle < 7.4) return 'waxing crescent';
    if (dayOfMoonCycle < 9.4) return 'first quarter';
    if (dayOfMoonCycle < 13.5) return 'waxing gibbous';
    if (dayOfMoonCycle < 15.5) return 'full';
    if (dayOfMoonCycle < 21.4) return 'waning gibbous';
    if (dayOfMoonCycle < 23.4) return 'last quarter';
    if (dayOfMoonCycle < 29.5) return 'waning crescent';
    return 'approaching new moon';
}

export function fishing_forecast() {
    return new Promise((resolve, reject) => {
        Promise.all([
            getWeather(),
        ]).then(([weatherData]) => {
        const weather = weatherData.weathertype;
        const rain_intensity = weatherData.rain_intensity; // Based on your logic to determine intensity
        const barometric_pressure = weatherData.barometric_pressure; // Interpretation required

        const time_of_day = getTimeOfDay();
        const season = getSeason();
        const moon_phase = getMoonPhase();

        var score = 0;

        console.log(weather, barometric_pressure, rain_intensity, time_of_day, season, moon_phase)

        // Weather conditions
        if (weather === 'clouds') {
            score += 20;
        } else if (weather === 'rain' && rain_intensity === 'light') {
            score += 25;
        } else if (weather === 'sunny') {
            score -= 10;
        }


        // Time of day
        if (time_of_day === 'early_morning' || time_of_day === 'late_afternoon') {
            score += 20;
        } else if (time_of_day === 'mid_morning' || time_of_day === 'early_afternoon') {
            score += 10;
        }

        // Season
        if (optimal_seasons.includes(season)) { // Define optimal seasons for species
            score += 15;
        }


        // Moon phase
            switch(moon_phase) {
                case 'full':
                case 'new':
                    score += 30; // Best times for mackerel fishing
                    break;
                case 'waxing crescent':
                case 'waning crescent':
                case 'approaching new moon':
                    score += 20; // Favorable, but not as optimal as 'new' or 'full'
                    break;
                case 'first quarter':
                case 'last quarter':
                    score += 15; // Intermediate effectiveness
                    break;
                case 'waxing gibbous':
                case 'waning gibbous':
                    score += 10; // Might not be as productive as the days closer to the full moon
                    break;
                default:
                    break; // No additional score for unlisted phases
            }


        if (barometric_pressure < 1000) {
            score -= 5;
        } else if (barometric_pressure > 1030) {
            score -= 5;
        } else if (barometric_pressure >= 1000 && barometric_pressure < 1010) {
            score += 0;
        } else if (barometric_pressure >= 1010 && barometric_pressure < 1020) {
            score += 10;
        } else if (barometric_pressure >= 1020 && barometric_pressure < 1030) {
            score += 15;
        } else if (barometric_pressure === IDEAL_PRESSURE) {
            score += 20;
        }

            const maxScore = 110;
            const percentage = (score / maxScore) * 100;

            resolve(percentage);
        })
            .catch(error => reject(error));
    });
}

