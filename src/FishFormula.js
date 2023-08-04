function fishing_forecast(weather, tide, time_of_day, season, water_temperature, moon_phase, barometric_pressure) {
    var score = 0;

    // Weather conditions
    if (weather === 'overcast') {
        score += 20;
    } else if (weather === 'rain' && rain_intensity === 'light') {
        score += 15;
    } else if (weather === 'sunny') {
        score -= 10;
    }

    // Tide
    if (tide === 'rising' || tide === 'falling') {
        score += 25;
    } else if (tide === 'high') {
        score += 15;
    } else if (tide === 'low') {
        score += 5;
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
    if (optimal_temperature - 2 < water_temperature && water_temperature < optimal_temperature + 2) {
        score += 30;
    } else if (optimal_temperature - 5 < water_temperature && water_temperature < optimal_temperature + 5) {
        score += 15;
    }

    // Moon phase
    if (moon_phase === 'full' || moon_phase === 'new') {
        score += 10;
    }

    // Barometric Pressure
    if (barometric_pressure === 'stable') {
        score += 20;
    } else if (barometric_pressure === 'slightly_falling') {
        score += 10;
    } else if (barometric_pressure === 'drastically_falling' || barometric_pressure === 'drastically_rising') {
        score -= 15;
    }

    return score;
}