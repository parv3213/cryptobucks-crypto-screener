import React, { useLayoutEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import GraphFilters from './GraphFilters';

interface ChartDataType {
  prices: number[][];
  market_caps: number[][];
  total_volumes: number[][];
}

const CustomTooltip = ({ active, payload, label, currency }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip text-sm text-cyan">
        <p className="label">{`${label} : ${new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: currency,
          minimumFractionDigits: 3,
        }).format(Number(payload[0].value))}`}</p>
      </div>
    );
  }

  return null;
};

const RenderLineChart = ({ data, currency, dataKey }: { data?: any[]; currency: string; dataKey?: string }) => {
  return (
    <ResponsiveContainer height={'90%'}>
      <LineChart width={400} height={400} data={data}>
        <Line type="monotone" dataKey="data" stroke="#14ffec" strokeWidth={'1px'} name={dataKey} />
        <CartesianGrid stroke="#323232" />
        <XAxis dataKey="time" hide />
        <YAxis dataKey="data" hide domain={['auto', 'auto']} />
        <Tooltip content={<CustomTooltip currency={currency} />} />
        <Legend />
      </LineChart>
    </ResponsiveContainer>
  );
};

const Chart = ({ coinId, currency }: { coinId: string; currency: string }) => {
  const [chartData, setChartData] = useState<ChartDataType>();
  const [numDays, setNumDays] = useState<7 | 14 | 30>(7);
  const [dataKey, setDataKey] = useState<'prices' | 'market_caps' | 'total_volumes'>('prices');
  const [convertedData, setConvertedData] = useState<{ time: string; data: number }[]>();

  const handleDataKeyChange = (change: any) => {
    setDataKey(change);
  };

  const handleNumDaysChange = (change: any) => {
    setNumDays(change);
  };

  useLayoutEffect(() => {
    (async () => {
      try {
        const data: ChartDataType = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency}&days=${numDays}&interval=daily`,
        )
          .then(res => res.json())
          .then(json => json);

        setChartData(data);
      } catch (e) {
        console.log(e);
        alert('Error calling Coingecko API. Try again later.');
      }
    })();
  }, [coinId, currency, numDays]);

  useLayoutEffect(() => {
    if (chartData) {
      const convertedData = chartData[dataKey].map(specificData => {
        return { time: new Date(specificData[0]).toLocaleDateString(), data: specificData[1] };
      });
      setConvertedData(convertedData);
    }
  }, [chartData, dataKey]);

  return (
    <div className="h-[70%] w-full">
      <RenderLineChart data={convertedData} currency={currency} dataKey={dataKey} />
      <div className="flex flex-wrap">
        {/* Data Filter */}
        <GraphFilters title="Price" handleClick={handleDataKeyChange} value="prices" currentSelected={dataKey} />
        <GraphFilters
          title="Market Cap"
          handleClick={handleDataKeyChange}
          value="market_caps"
          currentSelected={dataKey}
        />
        <GraphFilters
          title="Total Volumes"
          handleClick={handleDataKeyChange}
          value="total_volumes"
          currentSelected={dataKey}
        />

        {/* Days Filter */}
        <GraphFilters title="7d" handleClick={handleNumDaysChange} value={7} currentSelected={numDays} />
        <GraphFilters title="14d" handleClick={handleNumDaysChange} value={14} currentSelected={numDays} />
        <GraphFilters title="30d" handleClick={handleNumDaysChange} value={30} currentSelected={numDays} />
      </div>
    </div>
  );
};

export default Chart;
