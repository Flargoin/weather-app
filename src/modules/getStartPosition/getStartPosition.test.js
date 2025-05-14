import { API_KEY_YANDEX_STATIC, API_KEY_OWM } from '../../services/keys';
import { getImagePosition, getWeatherInfoByCity, requestGeolocation } from './getStartPosition';

describe('API Requests Tests', () => {
    const mockCoords = { latitude: 55.7558, longitude: 37.6176 };
    const mockCity = 'Moscow';
    const mockWeatherData = {
        main: { temp: 293.15 },
        weather: [{ main: 'Clear' }]
    };

    beforeEach(() => {
        window.fetch = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getImagePosition', () => {
        it('should return correct Yandex Static Maps URL', async () => {
            const url = await getImagePosition(mockCoords.latitude, mockCoords.longitude);
            expect(url).toBe(`https://static-maps.yandex.ru/1.x/?ll=${mockCoords.longitude},${mockCoords.latitude}&z=12&l=map&apikey=${API_KEY_YANDEX_STATIC}`);
        });
    });

    describe('getWeatherInfo', () => {
        it('should return weather data for city', async () => {
            window.fetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockWeatherData)
            });

            const result = await getWeatherInfoByCity(mockCity);
            
            expect(window.fetch).toHaveBeenCalledWith(
                `https://api.openweathermap.org/data/2.5/weather?q=${mockCity}&appid=${API_KEY_OWM}`
            );
            expect(result).toEqual({
                temperature: 20,
                description: 'Clear'
            });
        });

        it('API errors', async () => {
            window.fetch.mockResolvedValueOnce({
                ok: false,
                status: 404
            });

            await expect(getWeatherInfoByCity(mockCity))
                .rejects.toThrow('Response status: 404');
        });

        it('Network errors', async () => {
            window.fetch.mockRejectedValueOnce(new Error('Network error'));

            await expect(getWeatherInfoByCity(mockCity))
                .rejects.toThrow('Response status: Network error');
        });
    });

    describe('requestGeolocation', () => {
        beforeEach(() => {
            window.navigator.geolocation = {
                getCurrentPosition: jest.fn()
            };
        });

        it('onSuccess', () => {
            const onSuccess = jest.fn();
            const onError = jest.fn();
            window.navigator.geolocation.getCurrentPosition.mockImplementationOnce((success) => {
                success({ coords: mockCoords });
            });

            requestGeolocation(onSuccess, onError);
            expect(onSuccess).toHaveBeenCalledWith(mockCoords);
            expect(onError).not.toHaveBeenCalled();
        });

        it('onError', () => {
            const onSuccess = jest.fn();
            const onError = jest.fn();
            window.navigator.geolocation.getCurrentPosition.mockImplementationOnce((_, error) => {
                error({ code: 1 });
            });

            requestGeolocation(onSuccess, onError);
            expect(onSuccess).not.toHaveBeenCalled();
            expect(onError).toHaveBeenCalledWith(expect.any(Error));
            expect(onError.mock.calls[0][0].message).toBe('Пользователь отказал в запросе геолокации.');
        });

        it('onError for position unavailable', () => {
            const onSuccess = jest.fn();
            const onError = jest.fn();
            window.navigator.geolocation.getCurrentPosition.mockImplementationOnce((_, error) => {
                error({ code: 2 });
            });

            requestGeolocation(onSuccess, onError);
            expect(onSuccess).not.toHaveBeenCalled();
            expect(onError).toHaveBeenCalledWith(expect.any(Error));
            expect(onError.mock.calls[0][0].message).toBe('Информация о местоположении недоступна.');
        });

        it('onError for timeout', () => {
            const onSuccess = jest.fn();
            const onError = jest.fn();
            window.navigator.geolocation.getCurrentPosition.mockImplementationOnce((_, error) => {
                error({ code: 3 });
            });

            requestGeolocation(onSuccess, onError);
            expect(onSuccess).not.toHaveBeenCalled();
            expect(onError).toHaveBeenCalledWith(expect.any(Error));
            expect(onError.mock.calls[0][0].message).toBe('Превышено время ожидания запроса геолокации.');
        });

        it('onError if geolocation is not supported', () => {
            const onSuccess = jest.fn();
            const onError = jest.fn();
            window.navigator.geolocation = undefined;

            requestGeolocation(onSuccess, onError);
            expect(onSuccess).not.toHaveBeenCalled();
            expect(onError).toHaveBeenCalledWith(expect.any(Error));
            expect(onError.mock.calls[0][0].message).toBe('Geolocation API не поддерживается вашим браузером.');
        });
    });
});