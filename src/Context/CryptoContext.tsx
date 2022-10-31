import { createContext, useLayoutEffect, useState } from 'react';

export const defaultParams = {
  currency: 'usd',
  sort: 'market_cap_desc',
  page: 1,
  perPage: 10,
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
  totalPages: number;
  page: number;
  perPage: number;
  setPerPage: React.Dispatch<React.SetStateAction<number>>;
  cryptoData: CryptoData[] | [];
  currency: string;
  sort: string;
  setCryptoData: React.Dispatch<React.SetStateAction<CryptoData[] | []>>;
  getCryptoData: (
    changeCurrency?: string,
    changeSort?: string,
    defaultSetup?: boolean,
    changePage?: number,
    changePerPage?: number,
  ) => Promise<any>;
  getSearchCoins: (searchString: string) => Promise<any>;
  setCryptoDataForCoin: (coinId: string) => Promise<any>;
  searchingCoin: boolean;
  setSearchingCoin: React.Dispatch<React.SetStateAction<boolean>>;
  gettingCyptoData: boolean;
  setGettingCryptoData: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CryptoContext = createContext<CryptoProviderInterface>({
  totalPages: 250,
  page: 1,
  perPage: 1,
  setPerPage: () => undefined,
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
  searchingCoin: false,
  setSearchingCoin: () => undefined,
  gettingCyptoData: false,
  setGettingCryptoData: () => undefined,
});

export const CryptoProvider = ({ children }: any) => {
  const [currency, setCurrency] = useState(defaultParams.currency);
  const [sort, setSort] = useState(defaultParams.sort);
  const [cryptoData, setCryptoData] = useState<CryptoData[] | []>([]);
  const [page, setPage] = useState(defaultParams.page);
  const [perPage, setPerPage] = useState(defaultParams.perPage);
  const [totalPages, setTotalPages] = useState<number>(250);
  const [gettingCyptoData, setGettingCryptoData] = useState(false);
  const [searchingCoin, setSearchingCoin] = useState(false);

  const getTotalPages = async () => {
    try {
      const data = await fetch(`https://api.coingecko.com/api/v3/coins/list?include_platform=false`)
        .then(res => res.json())
        .then(json => json);

      setTotalPages(data.length);
    } catch (error) {
      console.log(error);
    }
  };

  const getCryptoData = async (
    changeCurrency?: string,
    changeSort?: string,
    defaultSetup?: boolean,
    changePage?: number,
    changePerPage?: number,
  ) => {
    setGettingCryptoData(true);
    if (defaultSetup) {
      changeCurrency = defaultParams.currency;
      changeSort = defaultParams.sort;
      changePage = defaultParams.page;
      changePerPage = defaultParams.perPage;
    }
    try {
      const data = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${
          changeCurrency ? changeCurrency : currency
        }&order=${changeSort ? changeSort : sort}&per_page=${changePerPage ? changePerPage : perPage}&page=${
          changePage ? changePage : page
        }&sparkline=false&price_change_percentage=1h%2C24h%2C7d`,
      )
        .then(res => res.json())
        .then(json => json);

      changeCurrency && setCurrency(changeCurrency);
      changeSort && setSort(changeSort);
      changePage && setPage(changePage);
      changePerPage && setPerPage(changePerPage);
      setCryptoData(data);
    } catch (error) {
      console.log(error);
    } finally {
      setGettingCryptoData(false);
    }
  };

  useLayoutEffect(
    () => {
      getTotalPages();
      getCryptoData();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const getSearchCoins = async (searchString: string) => {
    setSearchingCoin(true);
    try {
      const data = await fetch(`https://api.coingecko.com/api/v3/search?query=${searchString}`)
        .then(res => res.json())
        .then(json => json);

      return data.coins as SearchResultObject[];
    } catch (error) {
      console.log(error);
    } finally {
      setSearchingCoin(false);
    }
  };

  const setCryptoDataForCoin = async (coinId: string) => {
    setGettingCryptoData(true);
    try {
      const data = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinId}&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=1h%2C24h%2C7d`,
      )
        .then(res => res.json())
        .then(json => json);

      setCryptoData(data);
    } catch (error) {
      console.log(error);
    } finally {
      setGettingCryptoData(false);
    }
  };

  return (
    <CryptoContext.Provider
      value={{
        totalPages,
        page,
        perPage,
        setPerPage,
        cryptoData,
        currency,
        sort,
        getCryptoData,
        setCryptoData,
        getSearchCoins,
        setCryptoDataForCoin,
        searchingCoin,
        setSearchingCoin,
        gettingCyptoData,
        setGettingCryptoData,
      }}
    >
      {children}
    </CryptoContext.Provider>
  );
};
