import React, { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";

export default function GoldPriceDashboard() {
  const [livePrice, setLivePrice] = useState(null);
  const [newYorkTime, setNewYorkTime] = useState(null);
  const [priceDifferences, setPriceDifferences] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const livePriceUrl = "https://goldbackend-f70034eb64ad.herokuapp.com/live";
  const historicalUrls = [7, 30, 60, 90, 180, 365, 1825].map(
    (days) =>
      `https://goldbackend-f70034eb64ad.herokuapp.com/last-entries?numEntries=${days}`
  );

  // Fetch Live Price and New York Time
  const fetchLivePrice = async () => {
    try {
      const response = await fetch(livePriceUrl);
      const data = await response.json();
      setLivePrice(data.price);
      setNewYorkTime(data.newYorkTime);
    } catch (error) {
      console.error("Error fetching live price:", error);
    }
  };

  // Fetch Historical Prices
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

  useEffect(() => {
    fetchLivePrice();
    fetchHistoricalPrices();
    const interval = setInterval(fetchLivePrice, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p className="text-center text-gray-400">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="container mx-auto p-6 flex flex-col items-center">
      <div className="w-full md:w-3/4 lg:w-2/3 xl:w-4/5 bg-gray-800 rounded-lg p-8 shadow-xl overflow-x-auto">
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          Gold Price Performance
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left table-auto">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-3 text-[#EAB308]">Time Period</th>
                <th className="py-3 text-right text-[#EAB308]">Price Diff</th>
                <th className="py-3 text-right text-[#EAB308]">Change</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(priceDifferences).map(([days, oldPrice]) => {
                const diff = livePrice - oldPrice;
                const percentageChange = ((diff / oldPrice) * 100).toFixed(2);
                return (
                  <tr
                    key={days}
                    className="border-b border-gray-700 last:border-0 hover:bg-gray-700/50"
                  >
                    <td className="py-4 text-white">{getLabel(days)}</td>
                    <td
                      className={`text-right py-4 ${
                        diff >= 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      ${Math.abs(diff).toFixed(2)}
                    </td>
                    <td
                      className={`text-right py-4 ${
                        diff >= 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      <div className="flex items-center justify-end">
                        {diff >= 0 ? (
                          <TrendingUp size={16} className="mr-1" />
                        ) : (
                          <TrendingDown size={16} className="mr-1" />
                        )}
                        {percentageChange}%
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Function to get readable time labels
function getLabel(days) {
  const labels = {
    7: "Last Week",
    30: "Last Month",
    60: "Last 2 Months",
    90: "Last 3 Months",
    180: "Last 6 Months",
    365: "Last Year",
    1825: "Last 5 Years",
  };
  return labels[days] || `${days} Days Ago`;
}
