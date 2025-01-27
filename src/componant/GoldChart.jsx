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

// Register Chart.js components
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
  // Parse DD-MM-YYYY HH:mm format
  const [datePart, _timePart] = dateString.split(' ');
  const [day, month, _year] = datePart.split('-');
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  // JavaScript months are 0-based, so subtract 1 from the month
  return `${months[parseInt(month, 10) - 1]} ${parseInt(day, 10)}`;
};

const GoldChart = () => {
  const [goldPrices, setGoldPrices] = useState([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGoldPrices = async () => {
      setIsLoading(true);

      let apiUrl = '';
      
      if (selectedTimeframe === '7d') {
        apiUrl = 'https://goldbackend-vpte.onrender.com/last-entries?numEntries=7';
      } else if (selectedTimeframe === '30d') {
        apiUrl = 'https://goldbackend-vpte.onrender.com/last-entries?numEntries=30';
      }else if (selectedTimeframe === '60d') {
        apiUrl = 'https://goldbackend-vpte.onrender.com/last-entries?numEntries=60';
      }else if (selectedTimeframe === '180d') {
        apiUrl = 'https://goldbackend-vpte.onrender.com/last-entries?numEntries=180';
      }else if (selectedTimeframe === '365d') {
        apiUrl = 'https://goldbackend-vpte.onrender.com/last-entries?numEntries=365';
      }else if (selectedTimeframe === '1825d') {
        apiUrl = 'https://goldbackend-vpte.onrender.com/last-entries?numEntries=1825';
      }

      try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Convert string data into structured format
        const parsedData = data.map((entry) => {
          const [timestamp, open, high, low, close] = entry.split(',');
          return {
            timestamp: timestamp,
            open: parseFloat(open),
            high: parseFloat(high),
            low: parseFloat(low),
            close: parseFloat(close),
          };
        });

        setGoldPrices(parsedData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching gold prices:', error);
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
        pointHoverRadius: 6,
        pointBackgroundColor: 'rgb(234, 179, 8)',
        pointHoverBackgroundColor: 'rgb(234, 179, 8)',
        pointBorderColor: 'rgb(255, 255, 255)',
        pointHoverBorderColor: 'rgb(255, 255, 255)',
        pointBorderWidth: 2,
        pointHoverBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleColor: 'rgb(209, 213, 219)',
        bodyColor: 'rgb(234, 179, 8)',
        borderColor: 'rgb(75, 85, 99)',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          title: (context) => {
            const timestamp = goldPrices[context[0].dataIndex].timestamp;
            return `Date: ${timestamp}`;
          },
          label: (context) => `Price: ₹${context.raw.toLocaleString('en-IN', {
            maximumFractionDigits: 2,
          })}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: 11,
          },
        },
      },
      y: {
        position: 'right',
        grid: {
          color: 'rgba(75, 85, 99, 0.2)',
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
          callback: (value) => `₹${value.toLocaleString('en-IN')}`,
          font: {
            size: 11,
          },
        },
      },
    },
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
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

      <div className="relative">
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
            <div className="text-gray-400 text-sm">Current Price</div>
            <div className="text-2xl font-bold text-yellow-500">
              ₹{goldPrices.length > 0 ? goldPrices[goldPrices.length - 1].close.toLocaleString('en-IN') : 'Loading...'}
            </div>
            <div className="text-green-400 text-sm flex items-center">
              +1.2% (24h)
            </div>
          </div>
        </div>

        <div className="h-[400px]">
          <Line data={chartData} options={options} />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-700/50 rounded-lg p-4">
          <div className="text-gray-400 text-sm">High</div>
          <div className="text-lg font-semibold text-white">
            ₹{goldPrices.length > 0 ? Math.max(...goldPrices.map(item => item.high)).toLocaleString('en-IN') : 'Loading...'}
          </div>
        </div>

        <div className="bg-gray-700/50 rounded-lg p-4">
          <div className="text-gray-400 text-sm">Average</div>
          <div className="text-lg font-semibold text-white">
            ₹{goldPrices.length > 0 ? (goldPrices.reduce((a, b) => a + b.close, 0) / goldPrices.length).toLocaleString('en-IN', {
              maximumFractionDigits: 2,
            }) : 'Loading...'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoldChart;
