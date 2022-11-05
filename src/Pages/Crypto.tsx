import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import Filter from '../Components/Filter';
import TableComponent from '../Components/TableComponent';
import { CryptoContext } from '../Context/CryptoContext';

const Crypto = () => {
  const { cryptoData } = useContext(CryptoContext);

  return (
    <section className="relative mt-8 mb-24 flex h-full w-[80%] flex-col lg:mt-16">
      <Filter />
      <TableComponent cryptoData={cryptoData} />
      <Outlet />
    </section>
  );
};

export default Crypto;
