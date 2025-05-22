/* 
    Этап №1
    1. Получить текущее местоположение пользователя. +
    2. Получить погоду в этом месте +

    Этап №2
    1. При вводе названия города или адреса, получаем погоду в этом месте(без повторений).
    2. Записываем в историю ввод пользователя.
    3. При клике на город из истории, получаем погоду в этом месте.
*/
import "./assets/style.css";
import { geoScripts } from "./modules/getStartPosition/getStartPosition";
import {
  loadHistoryFromStorage,
  saveToHistory,
} from "./modules/history/history";

const updateWeatherDisplay = async (lat, lon, weatherInfo) => {
  const map = document.querySelector(".map__img");
  const weatherTemp = document.querySelector(".map__info-temp");
  const weatherDescr = document.querySelector(".map__info-descr");

  map.src = await geoScripts.getImagePosition(lat, lon);
  weatherTemp.textContent = `${weatherInfo.temperature}°C`;
  weatherDescr.textContent = weatherInfo.description;
};

export function init() {
  const input = document.querySelector(".map__search");
  const btn = document.querySelector(".btn");
  const list = document.querySelector(".history__list");
  const map = document.querySelector(".map__img");
  let listHistory = loadHistoryFromStorage();

  const btnHandler = async () => {
    if (!input.value) return;

    const resWeather = await geoScripts.getWeatherInfoByCity(input.value);
    const resCoordinates = await geoScripts.getCoordinatesByCity(input.value);

    const [lat, lon] =
      resCoordinates.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos
        .split(", ")[0]
        .split(" ")
        .reverse();

    map.src = await geoScripts.getImagePosition(lat, lon);
    await updateWeatherDisplay(lat, lon, resWeather);

    saveToHistory({
      name: input.value,
      lat,
      lon,
      weatherDescr: resWeather.description,
      weatherTemp: `${resWeather.temperature}°C`,
    });
  };

  const listHandler = async () => {
    const target = event.target;
    if (target.tagName.toLowerCase() !== "li") return;

    const cityName = target.dataset.city;
    if (!cityName) return;

    listHistory = JSON.parse(localStorage.getItem("list")) || [];
    const cityData = listHistory.find((item) => item.name === cityName);

    if (cityData) {
      await updateWeatherDisplay(cityData.lat, cityData.lon, {
        temperature: parseInt(cityData.weatherTemp),
        description: cityData.weatherDescr,
      });
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    geoScripts.requestGeolocation(
      async ({ latitude, longitude }) => {
        const weatherInfo = await geoScripts.getWeatherInfoByCoordinates(
          latitude,
          longitude,
        );
        await updateWeatherDisplay(latitude, longitude, weatherInfo);
      },
      (error) => alert(error),
    );

    btn.addEventListener("click", btnHandler);

    list.addEventListener("click", listHandler);
  });
}

init();
