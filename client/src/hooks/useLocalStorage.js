import { useState, useEffect } from 'react';
import { storageService } from '../services/storage/localStorageService';

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    return storageService.get(key, initialValue);
  });

  useEffect(() => {
    storageService.set(key, value);
  }, [key, value]);

  return [value, setValue];
}

export default useLocalStorage;
