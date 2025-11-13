import { storage } from '../utils/storage';

describe('storage util', () => {
  beforeEach(() => {
    // asegurarnos de tener un localStorage falso en entorno de tests
    const localStorageMock = (function () {
      let store = {};
      return {
        getItem: (key) => (key in store ? store[key] : null),
        setItem: (key, value) => { store[key] = String(value); },
        removeItem: (key) => { delete store[key]; },
        clear: () => { store = {}; },
      };
    })();

    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      configurable: true,
      writable: true,
    });
  });

  test('setItem y getItem funcionan', () => {
    storage.setItem('foo', 'bar');
    expect(storage.getItem('foo')).toBe('bar');
  });

  test('removeItem funciona', () => {
    storage.setItem('a', '1');
    storage.removeItem('a');
    expect(storage.getItem('a')).toBeNull();
  });

  test('clear funciona', () => {
    storage.setItem('x', 'x');
    storage.setItem('y', 'y');
    storage.clear();
    expect(storage.getItem('x')).toBeNull();
    expect(storage.getItem('y')).toBeNull();
  });
});
