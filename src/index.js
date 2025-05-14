/* 
    Этап №1
    1. Получить текущее местоположение пользователя. +
    2. Получить погоду в этом месте +

    Этап №2
    1. При вводе названия города или адреса, получаем погоду в этом месте(без повторений).
    2. Записываем в историю ввод пользователя.
    3. При клике на город из истории, получаем погоду в этом месте.
*/
import './assets/style.css';
import { geoScripts } from './modules/getStartPosition/getStartPosition';


export function init() {
    const map = document.querySelector('.map__img');
    const weatherTemp = document.querySelector('.map__info-temp');
    const weatherDescr = document.querySelector('.map__info-descr');
    document.addEventListener('DOMContentLoaded', () => {
        geoScripts.requestGeolocation(
            async ({ latitude, longitude }) => {
                geoScripts.getImagePosition(latitude, longitude);
                const weatherInfo = await geoScripts.getWeatherInfoByCoordinates(latitude, longitude);
                map.src = await geoScripts.getImagePosition(latitude, longitude);
                weatherTemp.textContent = weatherInfo.temperature + '°C';
                weatherDescr.textContent = weatherInfo.description;
            },
            (error) => {
                alert(error);
            }
        );
    });
}

init();
