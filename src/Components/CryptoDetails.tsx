import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate, useParams } from 'react-router-dom';
import { CryptoContext } from '../Context/CryptoContext';
import Spinner from './Spinner';
import Arrow from './Arrow';
import Chart from './Chart';

const HighLowIndicator = ({ currentPrice, high, low }: { currentPrice: number; high: number; low: number }) => {
  const [green, setGreen] = useState(0);

  useEffect(() => {
    const total = high - low;
    const greenZone = ((high - currentPrice) / total) * 100;
    setGreen(greenZone);
  }, [currentPrice, high, low]);

  return (
    <div className="mt-4 flex w-full items-center md:mt-4">
      <div className="h-[5px] rounded-l-full bg-red" style={{ width: `${100 - green}%` }} />
      <div
        className="h-[5px] rounded-r-full bg-green"
        style={{
          width: `${green}%`,
        }}
      />
    </div>
  );
};

const CryptoDetails = () => {
  let navigate = useNavigate();

  const { coinId } = useParams();
  const { getCoinData, currency } = useContext(CryptoContext);
  const [cryptoData, setCryptoData] = useState<any>();

  useLayoutEffect(() => {
    (async () => {
      if (coinId) {
        const data = await getCoinData(coinId);
        setCryptoData(data);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coinId]);

  const close = () => {
    navigate('..');
  };

  return ReactDOM.createPortal(
    <div
      className="fixed top-0 flex h-full w-full items-center justify-center bg-gray-200 bg-opacity-30 font-nunito backdrop-blur-sm"
      onClick={close}
    >
      <div
        className="relative h-[75%] w-[90%] overflow-auto rounded-lg bg-gray-300 bg-opacity-75 text-white lg:h-[75%] lg:w-[65%]"
        onClick={e => e.stopPropagation()}
      >
        {cryptoData && coinId ? (
          <div className="flex h-full flex-col justify-between p-6">
            <div>
              {/* Coin Name */}
              <div className="flex items-center justify-start">
                <img src={cryptoData?.image?.large} alt="crypto-icon" className="mx-2 w-[3rem]" />
                <span className="text-xl">{cryptoData.name}</span>
                <span className="ml-2 rounded-md bg-cyan bg-opacity-30 px-2 py-0.5 uppercase text-cyan">
                  {cryptoData.symbol}
                </span>
              </div>
              {/* Coin Details */}
              <div className="mt-4 flex h-full w-full flex-col md:mt-4 md:flex-row md:items-start md:justify-between">
                <div className="w-full md:w-[45%] ">
                  {/* Price and change */}
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-100">Price</span>
                      <span className="text-lg">
                        {new Intl.NumberFormat('en-IN', {
                          style: 'currency',
                          currency: currency,
                          maximumSignificantDigits: 5,
                        }).format(Number(cryptoData?.market_data?.current_price[currency]))}
                      </span>
                    </div>
                    <div
                      className={`flex items-center justify-center rounded bg-opacity-30 px-1 ${
                        Number(cryptoData?.market_data?.price_change_percentage_24h) > 0
                          ? 'bg-green text-green'
                          : 'bg-red text-red'
                      } `}
                    >
                      <span className="mr-1">
                        {Number(cryptoData?.market_data?.price_change_percentage_24h).toFixed(2)}%
                      </span>
                      <Arrow
                        className={`${
                          Number(cryptoData?.market_data?.price_change_percentage_24h) > 0
                            ? 'rotate-180 fill-green'
                            : 'fill-red'
                        } w-[1rem]`}
                      />
                    </div>
                  </div>

                  {/* Market Cap and fdv */}
                  <div className="mt-4 flex flex-col justify-between md:mt-4 md:flex-row">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-100">Market Cap</span>
                      <span className="text-base">
                        {new Intl.NumberFormat('en-IN', {
                          style: 'currency',
                          currency: currency,
                          minimumFractionDigits: 0,
                        }).format(Number(cryptoData?.market_data?.market_cap[currency]))}
                      </span>
                    </div>
                    <div className="mt-4 flex flex-col md:mt-0">
                      <span className="text-sm text-gray-100">Fully Diluted Valuation</span>
                      <span className="text-base md:text-right">
                        {new Intl.NumberFormat('en-IN', {
                          style: 'currency',
                          currency: currency,
                          notation: 'compact',
                        }).format(Number(cryptoData?.market_data?.fully_diluted_valuation[currency]))}
                      </span>
                    </div>
                  </div>

                  {/* TV */}
                  <div className="mt-4 flex flex-col md:mt-4">
                    <span className="text-sm text-gray-100">Total Volume</span>
                    <span className="text-base">
                      {new Intl.NumberFormat('en-IN', {
                        style: 'currency',
                        currency: currency,
                        maximumSignificantDigits: 5,
                      }).format(Number(cryptoData?.market_data?.total_volume[currency]))}
                    </span>

                    <HighLowIndicator
                      currentPrice={cryptoData?.market_data?.current_price[currency]}
                      high={cryptoData?.market_data?.high_24h[currency]}
                      low={cryptoData?.market_data?.low_24h[currency]}
                    />

                    {/* Low and high */}
                    <div className="mt-4 flex justify-between md:mt-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-100">Low 24H</span>
                        <span className="text-base">
                          {new Intl.NumberFormat('en-IN', {
                            style: 'currency',
                            currency: currency,
                            minimumFractionDigits: 3,
                          }).format(Number(cryptoData?.market_data?.low_24h[currency]))}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-100">High 24H</span>
                        <span className="text-base">
                          {new Intl.NumberFormat('en-IN', {
                            style: 'currency',
                            currency: currency,
                            minimumFractionDigits: 3,
                          }).format(Number(cryptoData?.market_data?.high_24h[currency]))}
                        </span>
                      </div>
                    </div>

                    {/* Supply */}
                    <div className="mt-4 flex justify-between md:mt-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-100">Max Supply</span>
                        <span className="text-base">
                          {new Intl.NumberFormat('en-IN', {
                            style: 'currency',
                            currency: currency,
                            minimumFractionDigits: 2,
                          }).format(Number(cryptoData?.market_data?.max_supply))}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-100">Circulating Supply</span>
                        <span className="text-base">
                          {new Intl.NumberFormat('en-IN', {
                            style: 'currency',
                            currency: currency,
                            minimumFractionDigits: 2,
                          }).format(Number(cryptoData?.market_data?.circulating_supply))}
                        </span>
                      </div>
                    </div>

                    {/* Links and sentiment */}
                    <div className="mt-4 flex items-center justify-between md:mt-4">
                      <div className="flex flex-col">
                        {/* homepage */}
                        {cryptoData?.links?.homepage[0] ? (
                          <a
                            className="mb-2 rounded bg-gray-200 px-2 py-0.5 text-sm text-gray-100"
                            href={cryptoData.links.homepage[0]}
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            {cryptoData.links.homepage[0].substring(0, 30)}
                          </a>
                        ) : null}

                        {/* blockchain_site */}
                        {cryptoData?.links?.blockchain_site[0] ? (
                          <a
                            className="mb-2 rounded bg-gray-200 px-2 py-0.5 text-sm text-gray-100"
                            href={cryptoData.links.blockchain_site[0]}
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            {cryptoData.links.blockchain_site[0].substring(0, 30)}
                          </a>
                        ) : null}

                        {/* official_forum_url */}
                        {cryptoData?.links?.official_forum_url[0] ? (
                          <a
                            className="mb-2 rounded bg-gray-200 px-2 py-0.5 text-sm text-gray-100"
                            href={cryptoData.links.official_forum_url[0]}
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            {cryptoData.links.official_forum_url[0].substring(0, 30)}
                          </a>
                        ) : null}
                      </div>
                      <div className="flex flex-col justify-center">
                        <span className="text-sm text-gray-100">Sentiment</span>
                        {/* sentiment_votes_up_percentage */}
                        <div
                          className={`flex items-center justify-center rounded bg-green bg-opacity-30 px-1
                          text-green `}
                        >
                          <span className="mr-1">{Number(cryptoData?.sentiment_votes_up_percentage).toFixed(2)}%</span>
                          <Arrow className={`w-[1rem] rotate-180 fill-green`} />
                        </div>
                        <div
                          className={`mt-2 flex items-center justify-center rounded bg-red bg-opacity-30 px-1 text-red `}
                        >
                          <span className="mr-1">
                            {Number(cryptoData?.sentiment_votes_down_percentage).toFixed(2)}%
                          </span>
                          <Arrow className={`w-[1rem] fill-red`} />
                        </div>
                      </div>
                    </div>

                    {/* Gap */}
                  </div>
                </div>

                {/* Table and other details */}
                <div className="ml-0 flex h-full flex-col justify-start md:w-[55%] md:pl-6">
                  <Chart coinId={coinId} currency={currency} />
                  <div className="mt-4">
                    <div className="">
                      <span className="text-base text-gray-100">Market Cap Rank: </span>{' '}
                      <span>{Number(cryptoData.market_cap_rank)}</span>
                    </div>
                    <div className="my-2">
                      <span className="text-base text-gray-100">CoinGecko Rank: </span>{' '}
                      <span>{Number(cryptoData.coingecko_rank)}</span>
                    </div>
                    <div className="">
                      <span className="text-base text-gray-100">CoinGecko Score: </span>{' '}
                      <span>{Number(cryptoData.coingecko_score)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-end md:flex-row">
              {/* Facebook */}
              {cryptoData.links?.facebook_username ? (
                <a href={`https://www.facebook.com/${cryptoData.links?.facebook_username}`} className="ml-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1.5em"
                    height="1.5em"
                    viewBox="0 0 24 24"
                    style={{
                      msTransform: 'rotate(360deg)',
                      WebkitTransform: 'rotate(360deg)',
                      transform: 'rotate(360deg)',
                    }}
                  >
                    <path
                      fill="cyan"
                      fillRule="evenodd"
                      d="M0 12.067C0 18.033 4.333 22.994 10 24v-8.667H7V12h3V9.333c0-3 1.933-4.666 4.667-4.666.866 0 1.8.133 2.666.266V8H15.8c-1.467 0-1.8.733-1.8 1.667V12h3.2l-.533 3.333H14V24c5.667-1.006 10-5.966 10-11.933C24 5.43 18.6 0 12 0S0 5.43 0 12.067Z"
                      clipRule="evenodd"
                    />
                    <path fill="rgba(0, 0, 0, 0)" d="M0 0h24v24H0z" />
                  </svg>
                </a>
              ) : null}

              {/* Github */}
              {cryptoData.links?.repos_url?.github[0] ? (
                <a href={`https://github.com/${cryptoData.links?.repos_url?.github[0]}`} className="ml-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1.5em"
                    height="1.5em"
                    viewBox="0 0 24 24"
                    style={{
                      msTransform: 'rotate(360deg)',
                      WebkitTransform: 'rotate(360deg)',
                      transform: 'rotate(360deg)',
                    }}
                  >
                    <path
                      fill="cyan"
                      fillRule="evenodd"
                      d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z"
                      clipRule="evenodd"
                    />
                    <path fill="rgba(0, 0, 0, 0)" d="M0 0h24v24H0z" />
                  </svg>
                </a>
              ) : null}

              {/* Sub-Reddit */}
              {cryptoData.links?.subreddit_url ? (
                <a href={`${cryptoData.links?.subreddit_url}`} className="ml-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1.5em"
                    height="1.5em"
                    viewBox="0 0 24 24"
                    style={{
                      msTransform: 'rotate(360deg)',
                      WebkitTransform: 'rotate(360deg)',
                      transform: 'rotate(360deg)',
                    }}
                  >
                    <path
                      fill="cyan"
                      fillRule="evenodd"
                      d="M24 12c0 6.627-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0s12 5.373 12 12Zm-4.312-.942c.194.277.304.604.316.942a1.751 1.751 0 0 1-.972 1.596c.014.176.014.352 0 .528 0 2.688-3.132 4.872-6.996 4.872-3.864 0-6.996-2.184-6.996-4.872a3.444 3.444 0 0 1 0-.528 1.75 1.75 0 1 1 1.932-2.868 8.568 8.568 0 0 1 4.68-1.476l.888-4.164a.372.372 0 0 1 .444-.288l2.94.588a1.2 1.2 0 1 1-.156.732L13.2 5.58l-.78 3.744a8.544 8.544 0 0 1 4.62 1.476 1.751 1.751 0 0 1 2.648.258ZM8.206 12.533a1.2 1.2 0 1 0 1.996 1.334 1.2 1.2 0 0 0-1.996-1.334Zm3.806 4.891c1.065.044 2.113-.234 2.964-.876a.335.335 0 1 0-.468-.48A3.936 3.936 0 0 1 12 16.8a3.924 3.924 0 0 1-2.496-.756.324.324 0 0 0-.456.456 4.608 4.608 0 0 0 2.964.924Zm2.081-3.178c.198.132.418.25.655.25a1.199 1.199 0 0 0 1.212-1.248 1.2 1.2 0 1 0-1.867.998Z"
                      clipRule="evenodd"
                    />
                    <path fill="rgba(0, 0, 0, 0)" d="M0 0h24v24H0z" />
                  </svg>
                </a>
              ) : null}

              {/* Twitter */}
              {cryptoData.links?.twitter_screen_name ? (
                <a href={`https://www.twitter.com/${cryptoData.links?.twitter_screen_name}`} className="ml-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1.5em"
                    height="1.5em"
                    viewBox="0 0 1024 1024"
                    style={{
                      msTransform: 'rotate(360deg)',
                      WebkitTransform: 'rotate(360deg)',
                      transform: 'rotate(360deg)',
                    }}
                  >
                    <path
                      fill="cyan"
                      d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm215.3 337.7c.3 4.7.3 9.6.3 14.4 0 146.8-111.8 315.9-316.1 315.9-63 0-121.4-18.3-170.6-49.8 9 1 17.6 1.4 26.8 1.4 52 0 99.8-17.6 137.9-47.4-48.8-1-89.8-33-103.8-77 17.1 2.5 32.5 2.5 50.1-2a111 111 0 0 1-88.9-109v-1.4c14.7 8.3 32 13.4 50.1 14.1a111.13 111.13 0 0 1-49.5-92.4c0-20.7 5.4-39.6 15.1-56a315.28 315.28 0 0 0 229 116.1C492 353.1 548.4 292 616.2 292c32 0 60.8 13.4 81.1 35 25.1-4.7 49.1-14.1 70.5-26.7-8.3 25.7-25.7 47.4-48.8 61.1 22.4-2.4 44-8.6 64-17.3-15.1 22.2-34 41.9-55.7 57.6z"
                    />
                    <path fill="rgba(0, 0, 0, 0)" d="M0 0h1024v1024H0z" />
                  </svg>
                </a>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Spinner /> <span className="ml-2">please wait...</span>
          </div>
        )}
      </div>
    </div>,
    document.getElementById('model') as HTMLElement,
  );
};

export default CryptoDetails;
