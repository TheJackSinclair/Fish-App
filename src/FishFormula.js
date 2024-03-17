import axios from "axios";

const API_KEY = "211f1a1ffd69b587bde82333d98cb151";

function getWeather() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        axios
          .get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`,
          )
          .then((response) => {
            resolve({
              weathertype: response.data.weather[0].main.toLowerCase(),
              rain_intensity: response.data.rain ? "light" : "none",
              barometric_pressure: response.data.main.pressure,
              temprature: response.data.main.temp,
            });
          })
          .catch((error) => reject(error)); // Make sure to handle errors
      },
      (error) => reject(error),
    ); // Handle geolocation errors
  });
}

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 6) return "early_morning";
  if (hour < 10) return "mid_morning";
  if (hour < 14) return "early_afternoon";
  return "late_afternoon";
}

function getMonth() {
  return new Date().getMonth();
}

function getMoonPhase() {
  const dayOfMoonCycle =
    ((new Date().getTime() / (29.53 * 24 * 60 * 60 * 1000)) % 1) * 29.53;

  if (dayOfMoonCycle < 1.5) return "new";
  if (dayOfMoonCycle < 7.4) return "waxing crescent";
  if (dayOfMoonCycle < 9.4) return "first quarter";
  if (dayOfMoonCycle < 13.5) return "waxing gibbous";
  if (dayOfMoonCycle < 15.5) return "full";
  if (dayOfMoonCycle < 21.4) return "waning gibbous";
  if (dayOfMoonCycle < 23.4) return "last quarter";
  if (dayOfMoonCycle < 29.5) return "waning crescent";
  return "approaching new moon";
}

const moonScoreMapping = {
  full: 30,
  new: 30,
  "waxing crescent": 20,
  "waning crescent": 20,
  "first quarter": 15,
  "last quarter": 15,
  "waxing gibbous": 10,
  "waning gibbous": 10,
};

const troutMoonScoreAdjustment = {
  full: -10,
  new: -10,
  "waxing crescent": -5,
  "waning crescent": -5,
  "first quarter": -5,
  "last quarter": -5,
  "waxing gibbous": -5,
  "waning gibbous": -5,
};

const idealTempRanges = {
  cod: { min: 4, max: 10 }, // Cod prefer colder waters, especially in the North Sea.
  haddock: { min: 4, max: 10 }, // Similar to cod, haddock thrive in colder temperatures.
  mackerel: { min: 8, max: 14 }, // Mackerel prefer slightly warmer waters, especially in summer.
  bass: { min: 10, max: 20 }, // Bass can be found in warmer coastal areas around the UK.
  trout: { min: 7, max: 14 }, // Trout, especially in freshwater, prefer moderate temperatures.
};

export function fishing_forecast(fishType) {
  return new Promise((resolve, reject) => {
    Promise.all([getWeather()])
      .then(([weatherData]) => {
        const weather = weatherData.weathertype;
        const rain_intensity = weatherData.rain_intensity; // Based on your logic to determine intensity
        const barometric_pressure = weatherData.barometric_pressure; // Interpretation required
        const temperature = weatherData.temprature;

        const time_of_day = getTimeOfDay();
        const month = getMonth();
        const moon_phase = getMoonPhase();

        var score = 0;

        console.log(
          weather,
          barometric_pressure,
          rain_intensity,
          time_of_day,
          month,
          moon_phase,
          temperature,
        );

        // Weather conditions
        switch (fishType) {
          case "cod":
          case "haddock":
            // Cod and Haddock might prefer overcast conditions, which could lead to better fishing.
            if (weather === "clouds") {
              score += 25;
            } else if (weather === "rain" && rain_intensity === "light") {
              score += 20;
            } else if (weather === "sunny") {
              score -= 5;
            }
            break;

          case "mackerel":
            // Mackerel may not have a strong preference, but slight overcast or cloudy conditions could be beneficial.
            if (weather === "clouds") {
              score += 20;
            } else if (weather === "rain" && rain_intensity === "light") {
              score += 15;
            } else if (weather === "sunny") {
              score -= 10;
            }
            break;

          case "bass":
            // Bass fishing can be good on overcast days, and some anglers believe that bass bite more just before a storm.
            if (
              weather === "clouds" ||
              (weather === "rain" && rain_intensity === "light")
            ) {
              score += 30;
            } else if (weather === "sunny") {
              score -= 10;
            }
            break;

          case "trout":
            // Trout may prefer stable weather conditions, but slight cloud cover can also be beneficial.
            if (weather === "clouds") {
              score += 20;
            } else if (weather === "rain" && rain_intensity === "light") {
              score += 25;
            } else if (weather === "sunny") {
              score += 5; // Sunny weather isn't as detrimental for trout compared to some other species.
            }
            break;
          default:
            score += 0;
        }

        // Time of day
        switch (fishType) {
          case "cod":
          case "haddock":
            // Cod and Haddock are often more active during early morning and late afternoon.
            if (
              time_of_day === "early_morning" ||
              time_of_day === "late_afternoon"
            ) {
              score += 25;
            } else if (
              time_of_day === "mid_morning" ||
              time_of_day === "early_afternoon"
            ) {
              score += 15;
            }
            break;

          case "mackerel":
            // Mackerel can be caught throughout the day, but dawn and dusk might be slightly more productive.
            if (
              time_of_day === "early_morning" ||
              time_of_day === "late_afternoon"
            ) {
              score += 20;
            } else if (
              time_of_day === "mid_morning" ||
              time_of_day === "early_afternoon"
            ) {
              score += 10;
            }
            break;

          case "bass":
            // Bass are known to bite more during early morning and late afternoon.
            if (
              time_of_day === "early_morning" ||
              time_of_day === "late_afternoon"
            ) {
              score += 30;
            } else if (
              time_of_day === "mid_morning" ||
              time_of_day === "early_afternoon"
            ) {
              score += 10;
            }
            break;

          case "trout":
            // Trout fishing can be good in the early morning and late afternoon, especially for fly fishing.
            if (
              time_of_day === "early_morning" ||
              time_of_day === "late_afternoon"
            ) {
              score += 25;
            } else if (
              time_of_day === "mid_morning" ||
              time_of_day === "early_afternoon"
            ) {
              score += 15;
            }
            break;
          default:
            score += 0;
        }

        // Month
        if (fishType === "cod" && ((month) => 10 || month <= 3)) {
          score += 15;
        } else if (fishType === "haddock" && ((month) => 11 || month <= 3)) {
          score += 15;
        } else if (fishType === "mackeral" && ((month) => 5 && month <= 9)) {
          score += 15;
        } else if (fishType === "bass" && ((month) => 5 && month <= 10)) {
          score += 15;
        } else if (fishType === "trout" && ((month) => 3 && month <= 10)) {
          score += 15;
        }

        // Moon phase
        switch (fishType) {
          case "cod":
          case "haddock":
          case "mackerel":
          case "bass":
            score += moonScoreMapping[moon_phase] || 0;
            break;
          case "trout":
            let troutScore = moonScoreMapping[moon_phase]
              ? moonScoreMapping[moon_phase] +
                (troutMoonScoreAdjustment[moon_phase] || 0)
              : 0;
            score += troutScore;
            break;
          default:
            // No additional score for unlisted fish types
            break;
        }

        // Temp
        let tempRange = idealTempRanges[fishType] || { min: 0, max: 30 }; // Default range if fishType is not listed

        if (temperature >= tempRange.min && temperature <= tempRange.max) {
          score += 10; // Within ideal range
        } else if (
          (temperature >= tempRange.min - 3 && temperature < tempRange.min) ||
          (temperature > tempRange.max && temperature <= tempRange.max + 3)
        ) {
          score += 5; // Slightly outside ideal range
        } else {
          score -= 5; // Far outside ideal range
        }

        if (barometric_pressure < 1000) {
          score -= 5;
        } else if (barometric_pressure > 1030) {
          score -= 5;
        } else if (barometric_pressure >= 1000 && barometric_pressure < 1010) {
          score += 0;
        } else if (barometric_pressure === 1015) {
          score += 20;
        } else if (barometric_pressure >= 1010 && barometric_pressure < 1020) {
          score += 10;
        } else if (barometric_pressure >= 1020 && barometric_pressure < 1030) {
          score += 15;
        }

        const maxScore = 110;
        const percentage = (score / maxScore) * 100;

        resolve(percentage);
      })
      .catch((error) => reject(error));
  });
}
