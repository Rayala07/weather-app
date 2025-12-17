const forecastContainer = document.querySelector(".forecast");
const locationEl = document.querySelector(".location");
const tempEl = document.querySelector(".temperature");
const descriptionContainer = document.querySelector(".description");

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

let apiKey = "c18cf74ea4e0a2e7cabd5b11997dc92c";
let units = "metric";
let data;

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
    console.log(data);
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

// Call the function to get Weather
getWeather("Leh");

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
          <div class="day-icon"><img src="${iconPath}"></div>
        </div>
        <div class="temp">
          <p>Min: ${Math.round(day.tempMin)}°C</p><p>Max: ${Math.round(
      day.tempMax
    )}°C</p>
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
  let p = document.createElement("p");
  p.classList.add("location-name");
  p.textContent = currWeatherData.name;
  locationEl.appendChild(p);

  let p2 = document.createElement("p");
  p2.classList.add("temp-value");
  p2.textContent = `${Math.round(currWeatherData.main.temp)}°C`;
  tempEl.appendChild(p2);

  let p3 = document.createElement("p");
  p3.classList.add("weather-desc");
  p3.textContent = currWeatherData.weather[0].description;
  descriptionContainer.appendChild(p3);
}
