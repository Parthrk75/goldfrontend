import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function LiveGoldPrices() {
  const [priceData, setPriceData] = useState(null);
  const [previousPrice, setPreviousPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPriceData = () => {
    fetch('https://goldbackend-f70034eb64ad.herokuapp.com/live')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        return response.json();
      })
      .then((data) => {
        setPreviousPrice(priceData?.price || null);
        setPriceData({
          price: data.price,
          newYorkTime: new Date(data.newYorkTime).toLocaleString(),
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
    const interval = setInterval(fetchPriceData, 60000);
    return () => clearInterval(interval);
  }, [priceData]);

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

  return (
    <div className="flex flex-wrap justify-center gap-6 md:gap-12 px-4 md:px-12 mt-6">
      <PriceCard title="24K Gold" price={priceData.price} previousPrice={previousPrice} newYorkTime={priceData.newYorkTime} />
      <PriceCard title="22K Gold" price={priceData.price * 0.916} previousPrice={previousPrice * 0.916} newYorkTime={priceData.newYorkTime} />
      <PriceCard title="18K Gold" price={priceData.price * 0.75} previousPrice={previousPrice * 0.75} newYorkTime={priceData.newYorkTime} />
    </div>
  );
}

function PriceCard({ title, price, previousPrice, newYorkTime }) {
  const isPositive = previousPrice !== null && price >= previousPrice;
  const change = previousPrice !== null ? ((price - previousPrice) / previousPrice) * 100 : 0;

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg w-[300px] md:w-[350px] lg:w-[400px]">
      <h3 className="text-lg font-semibold mb-2 text-gray-300">{title}</h3>
      <p className="text-2xl font-bold text-yellow-500">${price.toFixed(2)}</p>
      <p className="text-sm text-gray-400 mt-1">New York Time: {newYorkTime}</p>
      <div className={`flex items-center mt-3 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
        {isPositive ? <TrendingUp size={20} className="mr-2" /> : <TrendingDown size={20} className="mr-2" />}
        <span>{change.toFixed(2)}%</span>
      </div>
    </div>
  );
}
