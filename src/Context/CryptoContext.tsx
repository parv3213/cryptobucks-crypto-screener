import { createContext, useLayoutEffect, useState } from 'react';

const defaultParams = {
  currency: 'usd',
  sort: 'market_cap_desc',
};

export interface CryptoData {
  id?: any;
  symbol?: any;
  name?: any;
  image?: any;
  current_price?: any;
  market_cap?: any;
  market_cap_rank?: any;
  fully_diluted_valuation?: any;
  total_volume?: any;
  high_24h?: any;
  low_24h?: any;
  price_change_24h?: any;
  price_change_percentage_24h?: any;
  market_cap_change_24h?: any;
  market_cap_change_percentage_24h?: any;
  circulating_supply?: any;
  total_supply?: any;
  max_supply?: any;
  ath?: any;
  ath_change_percentage?: any;
  ath_date?: any;
  atl?: any;
  atl_change_percentage?: any;
  atl_date?: any;
  roi?: any;
  last_updated?: any;
  price_change_percentage_1h_in_currency?: any;
  price_change_percentage_24h_in_currency?: any;
  price_change_percentage_7d_in_currency?: any;
}

export interface SearchResultObject {
  id?: any;
  name?: any;
  api_symbol?: any;
  symbol?: any;
  market_cap_rank?: any;
  thumb?: any;
  large?: any;
}

interface CryptoProviderInterface {
  cryptoData: CryptoData[] | [];
  currency: string;
  sort: string;
  setCryptoData: React.Dispatch<React.SetStateAction<CryptoData[] | []>>;
  getCryptoData: (currency?: string, sort?: string, defaultSetup?: boolean) => Promise<any>;
  getSearchCoins: (searchString: string) => Promise<any>;
  setCryptoDataForCoin: (coinId: string) => Promise<any>;
}

export const CryptoContext = createContext<CryptoProviderInterface>({
  cryptoData: [],
  currency: '',
  sort: '',
  setCryptoData: () => undefined,
  getCryptoData: async () => {
    return;
  },
  getSearchCoins: async () => {
    return;
  },
  setCryptoDataForCoin: async () => {
    return;
  },
});

export const CryptoProvider = ({ children }: any) => {
  const [currency, setCurrency] = useState(defaultParams.currency);
  const [sort, setSort] = useState(defaultParams.sort);
  const [cryptoData, setCryptoData] = useState<CryptoData[] | []>([]);

  const getCryptoData = async (changeCurrency?: string, changeSort?: string, defaultSetup?: boolean) => {
    if (defaultSetup) {
      changeCurrency = defaultParams.currency;
      changeSort = defaultParams.sort;
    }
    try {
      const data = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${
          changeCurrency ? changeCurrency : currency
        }&order=${
          changeSort ? changeSort : sort
        }&per_page=10&page=1&sparkline=false&price_change_percentage=1h%2C24h%2C7d`,
      )
        .then(res => res.json())
        .then(json => json);

      changeCurrency && setCurrency(changeCurrency);
      changeSort && setSort(changeSort);
      setCryptoData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useLayoutEffect(
    () => {
      getCryptoData();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const getSearchCoins = async (searchString: string) => {
    try {
      const data = await fetch(`https://api.coingecko.com/api/v3/search?query=${searchString}`)
        .then(res => res.json())
        .then(json => json);

      return data.coins as SearchResultObject[];
    } catch (error) {
      console.log(error);
    }
  };

  const setCryptoDataForCoin = async (coinId: string) => {
    try {
      const data = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinId}&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=1h%2C24h%2C7d`,
      )
        .then(res => res.json())
        .then(json => json);

      setCryptoData(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <CryptoContext.Provider
      value={{
        cryptoData,
        currency,
        sort,
        getCryptoData,
        setCryptoData,
        getSearchCoins,
        setCryptoDataForCoin,
      }}
    >
      {children}
    </CryptoContext.Provider>
  );
};
