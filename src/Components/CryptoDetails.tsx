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
                          }).format(Number(cryptoData?.market_data?.high_24h[currency]))}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-100">High 24H</span>
                        <span className="text-base">
                          {new Intl.NumberFormat('en-IN', {
                            style: 'currency',
                            currency: currency,
                            minimumFractionDigits: 3,
                          }).format(Number(cryptoData?.market_data?.low_24h[currency]))}
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
            <div className="text-right">LINKS</div>
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
