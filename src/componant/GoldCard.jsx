import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function LivePriceDemo() {
  const [priceData, setPriceData] = useState(null);
  const [previousPrice, setPreviousPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPriceData = () => {
    fetch('https://goldbackend-vpte.onrender.com/live')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        return response.json();
      })
      .then((data) => {
        setPreviousPrice(priceData?.price || null); // This will correctly set the previousPrice
        setPriceData({
          price: data.price,
          timestamp: new Date(data.updatedAt).toLocaleString(),
          newYorkTime: data.newYorkTime,
        });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPriceData();
    const interval = setInterval(fetchPriceData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [priceData]); // Add priceData to the dependency array to fetch new data on price change

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-400 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500 rounded-lg p-12 text-red-400">
        <h2 className="text-lg font-semibold mb-6">Error Loading Price Data</h2>
        <p>{error}</p>
      </div>
    );
  }

  const isPositive = priceData && previousPrice !== null && priceData.price >= previousPrice;

  return (
    <div className="space-y-12 px-8 sm:px-12 md:px-20 mt-10">
      {/* Centered Grid for Gold Prices */}
      <div className="flex flex-wrap justify-center gap-12 md:gap-16">
        <PriceCard 
          title="22K Gold" 
          price={priceData.price * 0.916} 
          change={previousPrice !== null ? ((priceData.price - previousPrice) / previousPrice * 100) : 0} 
        />
        <PriceCard 
          title="18K Gold" 
          price={priceData.price * 0.75} 
          change={previousPrice !== null ? ((priceData.price - previousPrice) / previousPrice * 100) : 0} 
        />
      </div>
    </div>
  );
}

function PriceCard({ title, price, change }) {
  const isPositive = change >= 0;

  return (
    <div className="bg-gray-800 rounded-lg p-8 shadow-lg w-full sm:w-[300px] md:w-[350px] lg:w-[400px]">
      <h3 className="text-lg font-semibold mb-6 text-gray-300">{title}</h3>
      <div className="flex items-center justify-between">
        <p className="text-2xl font-bold text-gray-200">${price.toFixed(2)}</p>
        <div className={`flex items-center ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
          <span className="ml-4">{change.toFixed(2)}%</span>
        </div>
      </div>
    </div>
  );
}

function PriceComparisonTable({ comparisons }) {
  return (
    <div className="bg-gray-800 rounded-lg p-12 shadow-xl">
      <h3 className="text-lg font-semibold mb-8 text-gray-300">Price Comparison</h3>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="pb-6 border-b border-gray-600 text-gray-400">Platform</th>
            <th className="pb-6 border-b border-gray-600 text-gray-400">Price</th>
          </tr>
        </thead>
        <tbody>
          {comparisons.map((comp, idx) => (
            <tr key={idx}>
              <td className="py-6 text-gray-400">{comp.platform}</td>
              <td className="py-6 text-yellow-400">${comp.price.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
