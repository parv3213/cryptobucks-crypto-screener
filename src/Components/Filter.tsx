import React, { useContext, useState } from 'react';

import submit from '../assets/submit-icon.svg';
import { CryptoContext } from '../Context/CryptoContext';
import Search from './Search';

const sortOptions = [
  { value: 'market_cap_desc', name: 'Market Cap Desc' },
  { value: 'gecko_desc', name: 'Gecko Desc' },
  { value: 'gecko_asc', name: 'Gecko Asc' },
  { value: 'market_cap_asc', name: 'Market Cap Asc' },
  { value: 'volume_asc', name: 'Volume Asc' },
  { value: 'volume_desc', name: 'Volume Desc' },
  { value: 'id_asc', name: 'Id Asc' },
  { value: 'id_desc', name: 'Id Desc' },
];

const ResetButton = ({
  getCryptoData,
  setCustomCurrency,
  display,
}: {
  getCryptoData: any;
  setCustomCurrency: any;
  display: any;
}) => {
  return (
    <div className={`h-8 w-8 ${display}`}>
      <svg
        className="cursor-pointer"
        onClick={() => {
          getCryptoData(undefined, undefined, true);
          setCustomCurrency('');
        }}
        xmlns="http://www.w3.org/2000/svg"
        width="2em"
        height="2em"
        viewBox="0 0 24 24"
        style={{
          msTransform: 'rotate(360deg)',
          WebkitTransform: 'rotate(360deg)',
          transform: 'rotate(360deg)',
        }}
      >
        <path fill="cyan" d="M12 16c1.671 0 3-1.331 3-3s-1.329-3-3-3-3 1.331-3 3 1.329 3 3 3z" />
        <path
          fill="cyan"
          d="M20.817 11.186a8.94 8.94 0 0 0-1.355-3.219 9.053 9.053 0 0 0-2.43-2.43 8.95 8.95 0 0 0-3.219-1.355 9.028 9.028 0 0 0-1.838-.18V2L8 5l3.975 3V6.002c.484-.002.968.044 1.435.14a6.961 6.961 0 0 1 2.502 1.053 7.005 7.005 0 0 1 1.892 1.892A6.967 6.967 0 0 1 19 13a7.032 7.032 0 0 1-.55 2.725 7.11 7.11 0 0 1-.644 1.188 7.2 7.2 0 0 1-.858 1.039 7.028 7.028 0 0 1-3.536 1.907 7.13 7.13 0 0 1-2.822 0 6.961 6.961 0 0 1-2.503-1.054 7.002 7.002 0 0 1-1.89-1.89A6.996 6.996 0 0 1 5 13H3a9.02 9.02 0 0 0 1.539 5.034 9.096 9.096 0 0 0 2.428 2.428A8.95 8.95 0 0 0 12 22a9.09 9.09 0 0 0 1.814-.183 9.014 9.014 0 0 0 3.218-1.355 8.886 8.886 0 0 0 1.331-1.099 9.228 9.228 0 0 0 1.1-1.332A8.952 8.952 0 0 0 21 13a9.09 9.09 0 0 0-.183-1.814z"
        />
        <path fill="rgba(0, 0, 0, 0)" d="M0 0h24v24H0z" />
      </svg>
    </div>
  );
};

const Filter = () => {
  const [customCurrency, setCustomCurrency] = useState('');
  const [, setCustomSort] = useState('');
  const { getCryptoData } = useContext(CryptoContext);

  return (
    <div className="mb-10 w-full border-gray-100 lg:rounded-lg lg:border-2 lg:border-solid">
      <div className="flex flex-col items-center justify-between lg:my-2 lg:mx-6 lg:flex-row">
        <Search />
        <div className="mt-4 flex w-full flex-col items-start justify-between sm:flex-row sm:items-center lg:mt-0 lg:justify-end xl:w-[50%]">
          <div className="mb-4 flex w-full items-center justify-between sm:mb-0 sm:w-auto">
            <form
              className="mr-6 flex items-center"
              onSubmit={e => {
                e.preventDefault();
                getCryptoData(customCurrency);
                setCustomCurrency('');
              }}
            >
              <span className="font-semibold">currency:</span>
              <input
                type="text"
                value={customCurrency}
                onChange={e => {
                  e.preventDefault();
                  setCustomCurrency(e.target.value);
                }}
                className="mx-2 w-12 rounded border border-transparent bg-gray-200  px-2 py-0.5 outline-0 placeholder:text-gray-100 focus:border-cyan"
                placeholder="usd"
                required
              />
              <button type="submit" className="h-8 w-8">
                <img src={submit} alt="submit" />
              </button>
            </form>
            <ResetButton getCryptoData={getCryptoData} setCustomCurrency={setCustomCurrency} display="sm:hidden flex" />
          </div>
          <div className="flex w-full items-center justify-center sm:w-auto">
            <span className="font-semibold">sort by:</span>
            {/* @ts-ignore */}
            <select
              className="ml-4 w-full flex-1 rounded bg-gray-200 text-gray-100 sm:mx-4 sm:w-40"
              onChange={e => {
                e.preventDefault();
                setCustomSort(e.target.value);
                getCryptoData(undefined, e.target.value);
              }}
            >
              {sortOptions.map(sortOption => {
                return (
                  <option value={sortOption.value} key={sortOption.value}>
                    {sortOption.name}
                  </option>
                );
              })}
            </select>
          </div>
          <ResetButton getCryptoData={getCryptoData} setCustomCurrency={setCustomCurrency} display="sm:block hidden" />
        </div>
      </div>
    </div>
  );
};

export default Filter;
