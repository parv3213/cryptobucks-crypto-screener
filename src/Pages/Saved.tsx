import React, { useContext, useLayoutEffect, useState } from 'react';
import TableComponent from '../Components/TableComponent';
import { CryptoContext, CryptoData } from '../Context/CryptoContext';
import { StorageContext } from '../Context/StorageContext';

const Saved = () => {
  const [cryptoData, setCryptoData] = useState<CryptoData[] | []>([]);
  const { savedCoins } = useContext(StorageContext);
  const { currency } = useContext(CryptoContext);

  useLayoutEffect(() => {
    (async () => {
      if (savedCoins.length === 0) {
        setCryptoData([]);
        return;
      }
      try {
        const data = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&ids=${savedCoins.toString()}&order=market_cap_desc&per_page=2000&page=1&sparkline=false&price_change_percentage=1h%2C24h%2C7d`,
        )
          .then(res => res.json())
          .then(json => json);

        setCryptoData(data);
      } catch (e) {
        console.log(e);
      }
    })();
  }, [savedCoins]);

  return (
    <div className="relative mt-8 mb-24 flex h-full w-[80%] flex-col lg:mt-16">
      <TableComponent cryptoData={cryptoData} />
    </div>
  );
};

export default Saved;
