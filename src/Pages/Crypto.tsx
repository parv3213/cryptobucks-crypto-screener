import React from 'react';
import Filter from '../Components/Filter';
import TableComponent from '../Components/TableComponent';

const Crypto = () => {
  return (
    <section className="relative mt-16 mb-24 flex h-full w-[80%] flex-col">
      <Filter />
      <TableComponent />
    </section>
  );
};

export default Crypto;
