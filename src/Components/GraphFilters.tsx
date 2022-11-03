import React from 'react';

const GraphFilters = ({
  title,
  currentSelected,
  value,
  handleClick,
}: {
  title: string;
  currentSelected: string | number;
  value: string | number;
  handleClick: (change: string | number) => void;
}) => {
  return (
    <button
      className={`${
        currentSelected === value ? 'bg-cyan text-cyan' : 'bg-gray-200 text-gray-100'
      } ml-2 rounded  bg-opacity-25 px-1 py-0.5 text-sm `}
      onClick={() => handleClick(value)}
    >
      {title}
    </button>
  );
};

export default GraphFilters;
