import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const formatDate = (dateString) => {
  const [datePart, _timePart] = dateString.split(' ');
  const [day, month, _year] = datePart.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[parseInt(month, 10) - 1]} ${parseInt(day, 10)}`;
};

const GoldChart = () => {
  const [goldPrices, setGoldPrices] = useState([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGoldPrices = async () => {
      setIsLoading(true);
      let apiUrl = `https://goldbackend-f70034eb64ad.herokuapp.com/last-entries`;
      if (selectedTimeframe !== '7d') {
        apiUrl += `?numEntries=${selectedTimeframe.replace('d', '')}`;
      }

      try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error('Invalid data format received');
        }

        const parsedData = data.map((entry) => {
          if (typeof entry === 'string') {
            const [timestamp, open, high, low, close] = entry.split(',');
            return {
              timestamp: timestamp.trim(),
              open: parseFloat(open),
              high: parseFloat(high),
              low: parseFloat(low),
              close: parseFloat(close),
            };
          } else {
            return {
              timestamp: entry.Date,
              open: parseFloat(entry.Open),
              high: parseFloat(entry.High),
              low: parseFloat(entry.Low),
              close: parseFloat(entry.Close),
            };
          }
        });

        setGoldPrices(parsedData);
      } catch (error) {
        console.error('Error fetching gold prices:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGoldPrices();
  }, [selectedTimeframe]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-400 border-t-transparent"></div>
      </div>
    );
  }

  const timeframes = [
    { label: '7D', value: '7d' },
    { label: '30D', value: '30d' },
    { label: '60D', value: '60d' },
    { label: '6M', value: '180d' },
    { label: '1Y', value: '365d' },
    { label: '5Y', value: '1825d' },
  ];

  const chartData = {
    labels: goldPrices.map(item => formatDate(item.timestamp)),
    datasets: [
      {
        label: 'Gold Price (Close)',
        data: goldPrices.map(item => item.close),
        fill: 'start',
        borderColor: 'rgb(234, 179, 8)',
        backgroundColor: 'rgba(234, 179, 8, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 4,
      },
    ],
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-xl mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Gold Price Chart</h2>
        <div className="flex gap-2">
          {timeframes.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setSelectedTimeframe(value)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                selectedTimeframe === value
                  ? 'bg-yellow-500 text-gray-900'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="h-[400px]">
        <Line data={chartData} />
      </div>
    </div>
  );
};

export default GoldChart;
