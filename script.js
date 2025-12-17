const forecastContainer = document.querySelector(".forecast");

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
          icon: forecast.weather[0].icon,
        });
      }
    });

    let dailyData = dailyForecast;
    renderData(dailyData);
  } catch (err) {
    console.log(err);
  }
}

// Call the function to get Weather
getWeather("Hyderabad");

function renderData(dailyData) {
  let generateHTML = "";

  dailyData.forEach((day) => {
    const dateObj = new Date(day.data.replace(" ", "T"));

    const dayName = dateObj.toLocaleString("en-US", { weekday: "long" });

    generateHTML += `
      <div class="day-card">
        <div class="day">
          <div class="day-name">${dayName}</div>
          <div class="day-icon"><img src="http://openweathermap.org/img/wn/${day.icon}@2x.png"></div>
        </div>
        <div class="temp">
          <p>Min: ${day.tempMin}°C</p><p>Max: ${day.tempMax}°C</p>
        </div>
      </div>
    `;
  });

  // console.log(generateHTML);
  forecastContainer.innerHTML = generateHTML;
}

function getWeatherIcon(weatherMain, isDay) {}
