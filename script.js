const forecastContainer = document.querySelector(".forecast");
const locationEl = document.querySelector(".location");
const tempEl = document.querySelector(".temperature");
const weatherIconEl = document.querySelector(".icon-container");
const descriptionContainer = document.querySelector(".description");
const dayNameEl = document.querySelector(".day-name");
const inputContainer = document.querySelector(".search-input");
const windEl = document.querySelector(".wind");
const humidityEl = document.querySelector(".humidity");
const rainEl = document.querySelector(".rain");

const icon_map = {
  Clear: {
    day: "./Icons/Animated/day.svg",
    night: "./Icons/Animated/night.svg",
  },

  Clouds: {
    day: "./Icons/Animated/cloudy-day-1.svg",
    night: "./Icons/Animated/cloudy-night-1.svg",
    default: "./Icons/Animated/cloudy.svg",
  },

  Rain: {
    default: "./Icons/Animated/rainy-1.svg",
  },

  Drizzle: {
    default: "./Icons/Animated/rainy-1.svg",
  },

  Thunderstorm: {
    default: "./Icons/Animated/thunder.svg",
  },

  Snow: {
    default: "./Icons/Animated/snowy-1.svg",
  },

  Mist: {
    default: "./Icons/Animated/cloudy.svg",
  },

  Fog: {
    default: "./Icons/Animated/cloudy.svg",
  },
};

const apiKey = window.ENV_API_KEY;
let units = "metric";
let data;

let cityName = "";

inputContainer.addEventListener("keyup", (event) => {
  if (event.key === "Enter" && inputContainer.value !== "") {
    cityName = inputContainer.value;
    sessionStorage.setItem("lastCity", cityName);
    getWeather(cityName);
  }
});

async function getWeather(city) {
  try {
    let rawData = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`
    );

    if (rawData.ok) {
      data = await rawData.json();
    } else {
      throw new Error(rawData.status);
    }
    renderCurrentWeather(data);
    getForecast(city);
  } catch (err) {
    console.log(err);
  }
}

async function getForecast(city) {
  try {
    let rawForecast = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${units}&appid=${apiKey}`
    );

    if (!rawForecast.ok) {
      throw new Error("Forecast fetch failed");
    }

    let forecastData = await rawForecast.json();

    let forecastList = forecastData.list;

    let dailyForecast = [];

    forecastList.forEach((forecast) => {
      if (forecast.dt_txt.includes("12:00:00")) {
        dailyForecast.push({
          data: forecast.dt_txt,
          tempMin: forecast.main.temp_min,
          tempMax: forecast.main.temp_max,
          weatherMain: forecast.weather[0].main,
          icon: forecast.weather[0].icon,
        });
      }
    });

    renderData(dailyForecast);
  } catch (err) {
    console.log(err);
  }
}

function renderData(dailyData) {
  let generateHTML = "";

  dailyData.forEach((day) => {
    const dateObj = new Date(day.data.replace(" ", "T"));
    const dayName = dateObj.toLocaleString("en-US", { weekday: "long" });

    const hour = dateObj.getHours();

    const isDay = hour >= 6 && hour <= 18;

    const iconPath = getWeatherIcon(day.weatherMain, isDay);

    generateHTML += `
        <div class="day-card">
          <div class="day">
            <div class="day-name">${dayName}</div>
            <div class="weather-type">
            ${day.weatherMain}</div>
            <div class="day-icon"><img src="${iconPath}" class="w-icon" ></div>
          </div>
          <div class="temp">
            <p>Min: ${Math.round(day.tempMin)}°C</p>
            <p>Max: ${Math.round(day.tempMax)}°C</p>
          </div>
        </div>
      `;
  });

  // console.log(generateHTML);
  forecastContainer.innerHTML = generateHTML;
}

function getWeatherIcon(weatherMain, isDay) {
  if (!icon_map[weatherMain]) {
    return icon_map.Clouds.default;
  }

  const weatherType = icon_map[weatherMain];

  if (isDay && weatherType.day) {
    return weatherType.day;
  }

  if (!isDay && weatherType.night) {
    return weatherType.night;
  }

  return weatherType.default || icon_map.Clouds.default;
}

function renderCurrentWeather(currWeatherData) {
  // Clear before creating -
  dayNameEl.innerHTML = "";
  weatherIconEl.innerHTML = "";
  locationEl.innerHTML = "";
  tempEl.innerHTML = "";
  descriptionContainer.innerHTML = "";
  dayNameEl.innerHTML = "";
  humidityEl.innerHTML = "";
  rainEl.innerHTML = "";
  windEl.innerHTML = "";

  // Now creating -
  let p = document.createElement("p");
  let span = document.createElement("span");
  span.classList.add("temp-unit");
  span.textContent = "°c";
  p.classList.add("location-name");
  p.textContent = currWeatherData.name;
  locationEl.appendChild(p);

  let p2 = document.createElement("p");
  p2.classList.add("temp-value");
  p2.textContent = `${Math.round(currWeatherData.main.feels_like)}`;
  p2.appendChild(span);
  tempEl.appendChild(p2);

  let p3 = document.createElement("p");
  p3.classList.add("weather-desc");
  p3.textContent = "It feels like, " + currWeatherData.weather[0].description;
  descriptionContainer.appendChild(p3);

  const utcTime = currWeatherData.dt * 1000;
  const cityOffset = currWeatherData.timezone * 1000;

  const cityTime = new Date(utcTime + cityOffset);
  const hour = cityTime.getUTCHours();
  const dayName = cityTime.toLocaleString("en-US", { weekday: "long" });

  const isDay = hour >= 6 && hour <= 18;

  const iconPath = getWeatherIcon(currWeatherData.weather[0].main, isDay);

  let p4 = document.createElement("p");
  p4.classList.add("day");
  p4.textContent = dayName;
  dayNameEl.appendChild(p4);

  let image = document.createElement("img");
  image.classList.add("weather-icon");
  image.src = iconPath;
  weatherIconEl.appendChild(image);

  let p5 = document.createElement("p");
  p5.classList.add("wind-tag");
  p5.innerHTML = "<i class='ri-windy-fill'></i> Wind";

  let p6 = document.createElement("p");
  p6.classList.add("wind-value");
  p6.textContent = currWeatherData.wind.speed + "m/s";

  windEl.appendChild(p5);
  windEl.appendChild(p6);

  let p7 = document.createElement("p");
  p7.classList.add("humidity-tag");
  p7.innerHTML = "<i class='ri-water-percent-line'></i> Humidity";

  let p8 = document.createElement("p");
  p8.classList.add("humidity-value");
  p8.textContent = currWeatherData.main.humidity + "%";

  humidityEl.appendChild(p7);
  humidityEl.appendChild(p8);

  if (currWeatherData.rain?.["3h"]) {
    let p9 = document.createElement("p");
    p9.classList.add("rain-tag");
    p9.innerHTML = "<i class='ri-drizzle-line'></i> Rain";

    let p10 = document.createElement("p");
    p10.classList.add("rain-value");
    p10.textContent = currWeatherData.rain["3h"] + "mm";

    rainEl.appendChild(p9);
    rainEl.appendChild(p10);
    rainEl.textContent = currWeatherData.rain["3h"];
  } else {
    let p9 = document.createElement("p");
    p9.classList.add("rain-tag");
    p9.innerHTML = "<i class='ri-drizzle-line'></i> Rain";

    let p10 = document.createElement("p");
    p10.classList.add("rain-value");
    p10.textContent = "No Rain Expected";

    rainEl.appendChild(p9);
    rainEl.appendChild(p10);
  }
}

function defaultCity() {
  let randomNumber = Math.floor(Math.random() * 3) + 1;

  if (randomNumber === 1) {
    getWeather("Delhi");
  } else if (randomNumber === 2) {
    getWeather("Mumbai");
  } else {
    getWeather("Hyderabad");
  }
}

const isNewSession = !sessionStorage.getItem("sessionStarted");
const lastCity = sessionStorage.getItem("lastCity");

if (isNewSession) {
  sessionStorage.setItem("sessionStarted", "true");
  defaultCity();
} else if (lastCity) {
  getWeather(lastCity);
} else {
  defaultCity();
}
