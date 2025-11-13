// Utilidad segura para acceder a localStorage
const isLocalStorageAvailable = () => {
  try {
    return typeof window !== 'undefined' && window.localStorage !== null;
  } catch (e) {
    return false;
  }
};

export const storage = {
  getItem: (key) => {
    if (isLocalStorageAvailable()) {
      try {
        return localStorage.getItem(key);
      } catch (e) {
        console.error('Error al leer localStorage:', e);
        return null;
      }
    }
    return null;
  },

  setItem: (key, value) => {
    if (isLocalStorageAvailable()) {
      try {
        localStorage.setItem(key, value);
      } catch (e) {
        console.error('Error al escribir en localStorage:', e);
      }
    }
  },

  removeItem: (key) => {
    if (isLocalStorageAvailable()) {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.error('Error al eliminar de localStorage:', e);
      }
    }
  },

  clear: () => {
    if (isLocalStorageAvailable()) {
      try {
        localStorage.clear();
      } catch (e) {
        console.error('Error al limpiar localStorage:', e);
      }
    }
  },
};
