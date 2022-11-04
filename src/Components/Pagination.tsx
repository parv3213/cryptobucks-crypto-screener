import React, { useContext, useState } from 'react';

import submit from '../assets/submit-icon.svg';
import paginationArrow from '../assets/pagination-arrow.svg';
import { CryptoContext, defaultParams } from '../Context/CryptoContext';

const Pagination = () => {
  const [changePerPage, setChangePerPage] = useState('');
  const { page, getCryptoData, perPage, totalPages } = useContext(CryptoContext);

  const TotalNumber = Math.ceil(totalPages / perPage);

  const next = () => {
    if (page === TotalNumber) {
      return null;
    } else {
      getCryptoData(undefined, undefined, undefined, page + 1);
    }
  };

  const prev = () => {
    if (page === 1) {
      return null;
    } else {
      getCryptoData(undefined, undefined, undefined, page - 1);
    }
  };

  const multiStepNext = () => {
    if (page + 3 >= TotalNumber) {
      getCryptoData(undefined, undefined, undefined, TotalNumber - 1);
    } else {
      getCryptoData(undefined, undefined, undefined, page + 3);
    }
  };

  const multiStepPrev = () => {
    if (page - 3 <= 1) {
      getCryptoData(undefined, undefined, undefined, TotalNumber + 1);
    } else {
      getCryptoData(undefined, undefined, undefined, page - 2);
    }
  };

  return (
    <div className="flex flex-col items-center justify-end md:ml-2 md:flex-row">
      <form
        className="mr-6 mb-2 flex items-center md:mb-0"
        onSubmit={e => {
          e.preventDefault();
          getCryptoData(undefined, undefined, undefined, defaultParams.page, Number(changePerPage));
          setChangePerPage('');
        }}
      >
        <span>per page:</span>
        <input
          type="text"
          min={1}
          max={250}
          value={changePerPage}
          onChange={e => {
            e.preventDefault();
            setChangePerPage(e.target.value);
          }}
          className="mx-2 w-8 rounded border border-transparent bg-gray-200  px-1 py-0.5 outline-0 placeholder:text-gray-100 focus:border-cyan"
          placeholder="10"
          required
        />
        <button type="submit">
          <img src={submit} alt="submit" />
        </button>
      </form>
      <div className="flex">
        <button>
          <img src={paginationArrow} alt="paginationArrow" className="w-[2rem] rotate-180" />
        </button>
        <ul className="mx-2 flex items-center font-semibold">
          {page + 1 === TotalNumber || page === TotalNumber ? (
            <li>
              {' '}
              <button
                onClick={multiStepPrev}
                className="flex h-8  w-8 items-center justify-center rounded-full text-lg outline-0 hover:text-cyan    "
              >
                ...
              </button>
            </li>
          ) : null}

          {page - 1 !== 0 ? (
            <li>
              <button
                onClick={prev}
                className="mx-1.5 flex  h-8 w-8 items-center justify-center rounded-full bg-gray-200 outline-0 hover:text-cyan"
              >
                {' '}
                {page - 1}{' '}
              </button>
            </li>
          ) : null}
          <li>
            <button
              disabled
              className="mx-1.5  flex h-8 w-8 items-center justify-center rounded-full bg-cyan text-gray-300 outline-0"
            >
              {page}
            </button>
          </li>

          {page + 1 !== TotalNumber && page !== TotalNumber ? (
            <li>
              <button
                onClick={next}
                className="mx-1.5 flex  h-8 w-8 items-center justify-center rounded-full bg-gray-200 outline-0 hover:text-cyan"
              >
                {page + 1}
              </button>
            </li>
          ) : null}

          {page + 1 !== TotalNumber && page !== TotalNumber ? (
            <li>
              {' '}
              <button
                onClick={multiStepNext}
                className="flex h-8  w-8 items-center justify-center rounded-full text-lg outline-0 hover:text-cyan    "
              >
                ...
              </button>
            </li>
          ) : null}

          {page !== TotalNumber ? (
            <li>
              <button
                onClick={() => getCryptoData(undefined, undefined, undefined, TotalNumber)}
                className="mx-1.5 flex  h-8 w-8 items-center justify-center rounded-full bg-gray-200 outline-0 hover:text-cyan"
              >
                {TotalNumber}
              </button>
            </li>
          ) : null}
        </ul>
        <button>
          <img src={paginationArrow} alt="paginationArrow" className="w-[2rem]" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
