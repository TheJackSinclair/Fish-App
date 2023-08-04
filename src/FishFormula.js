import axios from "axios";


const API_KEY = '211f1a1ffd69b587bde82333d98cb151';

// Define optimal temperatures and seasons for the species you're targeting
const optimal_seasons = ['spring', 'summer']; // Example
const IDEAL_PRESSURE = 1015;

function getWeather() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
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

function getWaterTemperature() {
    // Replace with an actual API request or other method
    return Promise.resolve(20); // Example
}

function getMoonPhase() {
    // Simplified logic; you might want to replace this with an accurate method
    const dayOfMoonCycle = (new Date().getTime() / (29.53 * 24 * 60 * 60 * 1000)) % 1;
    if (dayOfMoonCycle < 0.03 || dayOfMoonCycle > 0.97) return 'new';
    if (dayOfMoonCycle < 0.5) return 'full';
    return 'other';
}

export function fishing_forecast() {
    return new Promise((resolve, reject) => {
        Promise.all([
            getWeather(),
            getWaterTemperature()
        ]).then(([weatherData, water_temperature]) => {
        const weather = weatherData.weather;
        const rain_intensity = weatherData.rain_intensity; // Based on your logic to determine intensity
        const barometric_pressure = weatherData.barometric_pressure; // Interpretation required

        const time_of_day = getTimeOfDay();
        const season = getSeason();
        const moon_phase = getMoonPhase();

        var score = 0;

        // Weather conditions
        if (weather === 'overcast') {
            score += 20;
        } else if (weather === 'rain' && rain_intensity === 'light') {
            score += 15;
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

        // Water temperature
        if (water_temperature >= 5 && water_temperature <= 13) {
            score += 30;
        } else {
            score += 15;
        }

        // Moon phase
        if (moon_phase === 'full') {
            score += 30; // More optimal for mackerel
        } else if (moon_phase === 'new') {
            score += 20; // Still good, but less so than the full moon
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

            const maxScore = 160;
            const percentage = (score / maxScore) * 100;

            resolve(percentage);
        })
            .catch(error => reject(error));
    });
}

