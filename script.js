const searchForm = document.getElementById('searchForm');
const cityInput = document.getElementById('cityInput');
const loading = document.getElementById('loading');
const errorMsg = document.getElementById('errorMsg');
const weatherData = document.getElementById('weatherData');
const appBody = document.getElementById('appBody');

function getWeatherDetails(code) {
    let bgClass = "bg-gradient-to-br from-indigo-400 to-purple-400";
    let desc = "Unknown Condition";

    if (code === 0) {
        desc = "Clear sky";
        bgClass = "bg-gradient-to-br from-blue-400 to-amber-200";
    } else if (code === 1 || code === 2 || code === 3) {
        const descriptions = { 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast" };
        desc = descriptions[code];
        bgClass = "bg-gradient-to-br from-gray-400 to-blue-300";
    } else if (code === 45 || code === 48) {
        desc = "Fog";
        bgClass = "bg-gradient-to-br from-gray-300 to-gray-500";
    } else if ([51, 53, 55, 56, 57].includes(code)) {
        desc = "Drizzle";
        bgClass = "bg-gradient-to-br from-blue-300 to-gray-400";
    } else if ([61, 63, 65, 66, 67].includes(code)) {
        desc = "Rain";
        bgClass = "bg-gradient-to-br from-blue-600 to-gray-600";
    } else if ([71, 73, 75, 77].includes(code)) {
        desc = "Snow fall";
        bgClass = "bg-gradient-to-br from-blue-100 to-white";
    } else if ([80, 81, 82].includes(code)) {
        desc = "Rain showers";
        bgClass = "bg-gradient-to-br from-blue-700 to-gray-800";
    } else if ([85, 86].includes(code)) {
        desc = "Snow showers";
        bgClass = "bg-gradient-to-br from-gray-200 to-white";
    } else if ([95, 96, 99].includes(code)) {
        desc = "Thunderstorm";
        bgClass = "bg-gradient-to-br from-gray-900 to-purple-900";
    }

    return { desc, bgClass };
}

searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (!city) return;

    weatherData.classList.add('hidden');
    errorMsg.classList.add('hidden');
    loading.classList.remove('hidden');

    try {
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}`;
        const geoRes = await fetch(geoUrl);
        const geoJson = await geoRes.json();

        if (!geoJson.results || geoJson.results.length === 0) {
            throw new Error("City not found");
        }

        const { latitude, longitude, name, country } = geoJson.results[0];

        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
        const weatherRes = await fetch(weatherUrl);
        const weatherJson = await weatherRes.json();

        const current = weatherJson.current_weather;

        document.getElementById('cityName').textContent = `${name}, ${country}`;
        document.getElementById('temperature').textContent = `${current.temperature}°C`;
        document.getElementById('windSpeed').textContent = `${current.windspeed}`;

        const { desc, bgClass } = getWeatherDetails(current.weathercode);
        document.getElementById('weatherDesc').textContent = desc;

        appBody.className = `min-h-screen flex items-center justify-center p-4 ${bgClass}`;

        weatherData.classList.remove('hidden');

    } catch (error) {
        console.error("Error fetching weather:", error);
        errorMsg.classList.remove('hidden');

        appBody.className = "min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-400 to-purple-400";
    } finally {
        loading.classList.add('hidden');
    }
});
