
import React, { useState, useEffect } from "react";
import GoldChart from "./GoldChart";

const GoldPriceCard = ({ title, price, time }) => (
  <div className="p-6 rounded-lg shadow-md bg-gray-800 text-white w-full text-center">
    <h2 className="text-lg font-semibold mb-2">{title}</h2>
    <p className="text-3xl font-bold text-green-400">${price?.toFixed(2) || "N/A"}</p>
    <p className="text-sm text-gray-400 mt-2">Updated at: {time}</p>
  </div>
);

export default function GoldPriceDashboard() {
  const [livePrice, setLivePrice] = useState(null);
  const [updatedTime, setUpdatedTime] = useState("");
  const [priceDifferences, setPriceDifferences] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const livePriceUrl = "https://goldbackend-f70034eb64ad.herokuapp.com/live";
  const historicalUrls = [7, 30, 60, 90, 180, 365, 1825].map(
    (days) => `https://goldbackend-f70034eb64ad.herokuapp.com/last-entries?numEntries=${days}`
  );

  useEffect(() => {
    const fetchLivePrice = async () => {
      try {
        const response = await fetch(livePriceUrl);
        const data = await response.json();
        setLivePrice(data.price);
        setUpdatedTime(new Date(data.newYorkTime).toLocaleString("en-US", {
          timeZone: "America/New_York",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }));
      } catch (error) {
        console.error("Error fetching live price:", error);
      }
    };

    const fetchHistoricalPrices = async () => {
      try {
        const results = await Promise.all(
          historicalUrls.map((url) => fetch(url).then((res) => res.json()))
        );
        const priceMap = {};

        [7, 30, 60, 90, 180, 365, 1825].forEach((days, index) => {
          if (results[index] && results[index].length > 0) {
            priceMap[days] = parseFloat(results[index][0].Close);
          }
        });

        setPriceDifferences(priceMap);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLivePrice();
    fetchHistoricalPrices();
    const interval = setInterval(fetchLivePrice, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p className="text-center text-gray-400">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="min-h-screen p-8 bg-gray-900 text-white flex flex-col items-center">
      <div className="w-full max-w-screen-xl">
        <h1 className="text-3xl font-bold text-center mb-6 text-yellow-400">Gold Price Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-6 mb-10">
          <GoldPriceCard title="24K Gold Price " price={livePrice} time={updatedTime} />
          <GoldPriceCard title="22K Gold Price" price={livePrice * 0.916} time={updatedTime} />
          <GoldPriceCard title="18K Gold Price" price={livePrice * 0.75} time={updatedTime} />
        </div>

        <div className="overflow-x-auto p-6 bg-gray-800 rounded-lg w-full shadow-md">
          <h2 className="text-2xl font-semibold text-center mb-4 text-yellow-400">Gold Price Performance</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-600 text-yellow-400">
                <th className="py-3 px-4 text-center">Time Period</th>
                <th className="py-3 px-4 text-center">Old Price</th>
                <th className="py-3 px-4 text-center">Price Diff</th>
                <th className="py-3 px-4 text-center">Change</th>
                <th className="py-3 px-4 text-center">Recommendation</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(priceDifferences).map(([days, oldPrice]) => {
                const diff = livePrice - oldPrice;
                const percentageChange = ((diff / oldPrice) * 100).toFixed(2);
                let recommendationClass = "text-gray-300";
                let recommendationText = "Hold";

                if (percentageChange > 5) {
                  recommendationClass = "text-green-400";
                  recommendationText = "Buy";
                } else if (percentageChange < -5) {
                  recommendationClass = "text-red-400";
                  recommendationText = "Sell";
                }

                return (
                  <tr key={days} className="border-b border-gray-700 hover:bg-gray-700 transition">
                    <td className="py-3 px-4 text-center">{days} Days</td>
                    <td className="py-3 px-4 text-center">${oldPrice.toFixed(2)}</td>
                    <td className={`py-3 px-4 text-center ${diff >= 0 ? "text-green-400" : "text-red-400"}`}>
                      ${Math.abs(diff).toFixed(2)}
                    </td>
                    <td className={`py-3 px-4 text-center ${diff >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {percentageChange}%
                    </td>
                    <td className={`py-3 px-4 text-center font-bold ${recommendationClass}`}>{recommendationText}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-8">
          <GoldChart />
        </div>
      </div>
    </div>
  );
}
