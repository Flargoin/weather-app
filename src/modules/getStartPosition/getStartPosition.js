import {
  API_KEY_YANDEX_STATIC,
  API_KEY_OWM,
  API_KEY_YANDEX_GEOCODER,
} from "../../services/keys";

export const getImagePosition = async (lat, lon) => {
  return `https://static-maps.yandex.ru/1.x/?ll=${lon},${lat}&z=12&l=map&apikey=${API_KEY_YANDEX_STATIC}`;
};

export const getCoordinatesByCity = async (city) => {
  const geolocationUrl = `https://geocode-maps.yandex.ru/v1/?apikey=${API_KEY_YANDEX_GEOCODER}&geocode=${city}&format=json`;
  try {
    const response = await fetch(geolocationUrl);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    throw new Error(`${error}`);
  }
};

export const getWeatherInfoByCity = async (city) => {
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY_OWM}`;
  try {
    const response = await fetch(weatherUrl);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    return {
      temperature: Math.round(json.main.temp - 273.15),
      description: json.weather[0].main,
    };
  } catch (error) {
    throw new Error(`Response status: ${error.message || "Unknown error"}`);
  }
};

export const getWeatherInfoByCoordinates = async (lat, lon) => {
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY_OWM}`;
  try {
    const response = await fetch(weatherUrl);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    return {
      temperature: Math.round(json.main.temp - 273.15),
      description: json.weather[0].main,
    };
  } catch (error) {
    throw new Error(`Response status: ${error.message || "Unknown error"}`);
  }
};

export const requestGeolocation = (onSuccess, onError) => {
  if (!navigator.geolocation) {
    const err = new Error("Geolocation API не поддерживается вашим браузером.");
    if (onError) onError(err);
    else throw err;
  } else {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (onSuccess) {
          onSuccess({ latitude, longitude });
        }
      },
      (error) => {
        let err;
        switch (error.code) {
          case 1:
            err = new Error("Пользователь отказал в запросе геолокации.");
            break;
          case 2:
            err = new Error("Информация о местоположении недоступна.");
            break;
          case 3:
            err = new Error("Превышено время ожидания запроса геолокации.");
            break;
          default:
            err = new Error(
              "Произошла неизвестная ошибка при получении геолокации.",
            );
        }
        if (onError) onError(err);
        else throw err;
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  }
};

export const geoScripts = {
  getImagePosition,
  getWeatherInfoByCity,
  getWeatherInfoByCoordinates,
  requestGeolocation,
  getCoordinatesByCity,
};
