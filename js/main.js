"use strict";
//!============================================= initiate Default data =================================================!//
window.onload = function () {
  getTemperature();
};

//!============================================= Start Get location from user =================================================!//
const searchByLocationElement = document.getElementById(
  "searchByLocationInput"
);
const searchByLocationButton = document.getElementById("searchByLocationBtn");

searchByLocationButton.addEventListener("click", (e) => {
  e.preventDefault();
  getTemperature(searchByLocationElement.value);
});

//!============================================= End Get location from user =================================================!//
//!=============================================  Start Calling API =================================================!//
async function getTemperature(location = "Cairo") {
  try {
    const res = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=de68219cf046445c83101841250211&q=${location}&days=3`
    );
    const data = await res.json();
    const forecast = data.forecast.forecastday;

    firstCard({
      date: forecast[0].date,
      location: data.location.name,
      temp: data.current.temp_c,
      icon: "https:" + data.current.condition.icon,
      text: data.current.condition.text,
      rain: forecast[0].day.daily_chance_of_rain,
      windDir: data.current.wind_dir,
      windSpeed: data.current.wind_kph,
    });

    updateForecastCard("#tomorrow-card", forecast[1]);
    updateForecastCard("#after-tomorrow-card", forecast[2]);
  } catch (err) {
    console.log(`Something went wrong: ${err}`);
    alert(`Something went wrong: ${err}`);
  }
}

//!=============================================  End Calling API =================================================!//
//!=============================================  Start method Help to put data into cards =================================================!//
function firstCard({
  date,
  location,
  temp,
  icon,
  text,
  rain,
  windDir,
  windSpeed,
}) {
  const card = document.querySelector("#today-card");
  const currDate = new Date(date);

  card.querySelector(".day").textContent = currDate.toLocaleDateString(
    "en-US",
    { weekday: "long" }
  );
  card.querySelector(
    ".date"
  ).textContent = `${currDate.getDate()} ${currDate.toLocaleDateString(
    "en-US",
    { month: "long" }
  )}`;
  card.querySelector(".card-title").textContent = location;

  const tempContainer = card.querySelector(".temperature");
  tempContainer.textContent = "";
  tempContainer.append(`${temp}`, "°C");

  const image = card.querySelector(".weather-icon img");
  image.src = icon;
  image.alt = text;

  card.querySelector("p").textContent = text;
  card.querySelector("#humidity").textContent = `${rain}%`;
  card.querySelector("#wind").textContent = `${windSpeed} km/h`;
  card.querySelector("#direction").textContent = windDir;
}

function updateForecastCard(id, data) {
  const card = document.querySelector(id);
  const currDate = new Date(data.date);

  card.querySelector(".day").textContent = currDate.toLocaleDateString(
    "en-US",
    { weekday: "long" }
  );
  const image = card.querySelector(".weather-icon img");
  image.src = "https:" + data.day.condition.icon;
  image.alt = data.day.condition.text;

  const highTemp = card.querySelector(".the-high");
  const lowTemp = card.querySelector(".the-low");

  highTemp.textContent = "";
  lowTemp.textContent = "";

  highTemp.append(`${data.day.maxtemp_c}`, "°C");
  lowTemp.append(`${data.day.mintemp_c}`, "°C");

  card.querySelector("p").textContent = data.day.condition.text;
}
//!=============================================   End method Help to put data into cards  =================================================!//
