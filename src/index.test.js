import { init } from './index';
import { geoScripts } from './modules/getStartPosition/getStartPosition';

// Мокаем geoScripts
jest.mock('./modules/getStartPosition/getStartPosition', () => ({
    geoScripts: {
        requestGeolocation: jest.fn()
    }
}));

describe('Init app', () => {
    beforeEach(() => {
        // Очищаем все моки перед каждым тестом
        jest.clearAllMocks();
        
        // Сбрасываем DOM
        document.body.innerHTML = '';
    });

    it('is a function', () => {
        expect(typeof init).toBe('function');
    });

    it('DOMContentLoaded', () => {
        // Симулируем загрузку DOM
        document.dispatchEvent(new Event('DOMContentLoaded'));

        // Проверяем, что requestGeolocation был вызван с двумя функциями
        expect(geoScripts.requestGeolocation).toHaveBeenCalledWith(
            expect.any(Function),
            expect.any(Function)
        );
    });
}); 