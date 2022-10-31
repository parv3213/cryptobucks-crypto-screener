import React, { useContext, useState } from 'react';
import search from '../assets/search-icon.svg';
import { CryptoContext, SearchResultObject } from '../Context/CryptoContext';
import debounce from 'lodash.debounce';
import Spinner from './Spinner';

const SearchInput = ({
  handleSearch,
  searchResult,
}: {
  handleSearch: (query: any) => Promise<void>;
  searchResult: SearchResultObject[];
}) => {
  const [searchString, setSearchString] = useState('');
  const { setCryptoDataForCoin, searchingCoin } = useContext(CryptoContext);

  return (
    <div className="relative w-96">
      <form className="relative flex w-full items-center rounded bg-gray-200" onSubmit={e => e.preventDefault()}>
        <input
          value={searchString}
          type="text"
          className="w-full rounded border border-transparent bg-transparent px-2 py-0.5 outline-0 placeholder:text-gray-100 focus:border-cyan"
          placeholder="search here..."
          onChange={e => {
            e.preventDefault();
            setSearchString(e.target.value);
            handleSearch(e.target.value);
          }}
        />
        <button type="submit" className="absolute right-1">
          <img src={search} alt="search" className="w-[1.25rem]" />
        </button>
      </form>
      {searchString.length > 0 ? (
        <div className="absolute top-12 z-[10] h-96 w-full overflow-scroll rounded bg-gray-200 bg-opacity-60 backdrop-blur-sm  ">
          {searchingCoin ? (
            <div className="flex h-full w-full items-center justify-center">
              <Spinner /> <span className="ml-2">Searching</span>
            </div>
          ) : (
            <ul className="mx-4 my-4">
              {searchResult.map((result): any => {
                return (
                  <li
                    className="my-2 flex cursor-pointer items-center rounded p-2 hover:bg-gray-100"
                    key={result.id}
                    onClick={e => {
                      e.preventDefault();
                      setCryptoDataForCoin(result.id);
                      setSearchString('');
                    }}
                  >
                    <img src={result.thumb} alt="symbol" className="mr-2 h-[auto] w-[1rem]" />
                    <span>{result.name}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
};

const Search = () => {
  const [searchResult, setSearchResult] = useState<SearchResultObject[]>([]);
  const { getSearchCoins } = useContext(CryptoContext);

  const debounceFunc = debounce(async query => {
    setSearchResult(await getSearchCoins(query));
  }, 2000) as (query: any) => Promise<void>;

  return <SearchInput handleSearch={debounceFunc} searchResult={searchResult} />;
};

export default Search;
