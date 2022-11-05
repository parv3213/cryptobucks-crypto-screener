import { createContext, useLayoutEffect, useState } from 'react';

interface StorageProviderInterface {
  savedCoins: string[];
  isSaved: (coinId: string) => boolean;
  saveCoin: (coinId: string) => any;
  deleteCoin: (coinId: string) => any;
}

export const StorageContext = createContext<StorageProviderInterface>({
  savedCoins: [],
  isSaved: () => false,
  saveCoin: () => {},
  deleteCoin: () => {},
});

export const StorageProvider = ({ children }: any) => {
  const [savedCoins, setSavedCoins] = useState<string[]>([]);

  useLayoutEffect(() => {
    const inLocalStorage = JSON.parse(String(localStorage.getItem('coins'))) || false;

    if (!inLocalStorage) {
      localStorage.setItem('coins', JSON.stringify([]));
    } else {
      setSavedCoins(inLocalStorage);
    }
  }, []);

  const isSaved = (coinId: string) => {
    if (savedCoins.indexOf(coinId) === -1) {
      return false;
    } else return true;
  };

  const saveCoin = (coinId: string) => {
    const newSaveCoins = [...savedCoins, coinId];
    localStorage.setItem('coins', JSON.stringify(newSaveCoins));
    setSavedCoins(newSaveCoins);
  };

  const deleteCoin = (coinId: string) => {
    const newSaveCoins = savedCoins.filter(el => el != coinId);
    localStorage.setItem('coins', JSON.stringify(newSaveCoins));
    setSavedCoins(newSaveCoins);
  };

  return (
    <StorageContext.Provider value={{ savedCoins, isSaved, saveCoin, deleteCoin }}>{children}</StorageContext.Provider>
  );
};
