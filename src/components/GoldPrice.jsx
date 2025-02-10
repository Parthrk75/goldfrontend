import React, { useState, useEffect } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function GoldPriceDashboard() {
  const [livePrice, setLivePrice] = useState(null);
  const [priceDifferences, setPriceDifferences] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const livePriceUrl = "https://goldbackend-f70034eb64ad.herokuapp.com/live";
  const historicalUrls = [7, 30, 60, 90, 180, 365, 1825].map(
    (days) =>
      `https://goldbackend-f70034eb64ad.herokuapp.com/last-entries?numEntries=${days}`
  );

  const fetchLivePrice = async () => {
    try {
      const response = await fetch(livePriceUrl);
      const data = await response.json();
      setLivePrice(data.price);
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

  useEffect(() => {
    fetchLivePrice();
    fetchHistoricalPrices();
    const interval = setInterval(fetchLivePrice, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p className="text-center text-gray-400">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="min-h-screen flex flex-col  items-center p-6">
      <div className="w-full max-w-[calc(100%-60px)] bg-gray-800 rounded-lg p-8 shadow-xl">
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          Gold Price Performance
        </h2>
        <div className="text-center text-gray-400 mb-4">
          Last Updated: {new Date().toLocaleString()}
        </div>

        <div className="overflow-x-auto p-4 bg-gray-900 rounded-lg w-full">
          <table className="w-full text-left table-auto border-collapse">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-3 px-6 text-[#EAB308] text-center">Time Period</th>
                <th className="py-3 px-6 text-[#EAB308] text-center">Old Price</th>
                <th className="py-3 px-6 text-[#EAB308] text-center">Price Diff</th>
                <th className="py-3 px-6 text-[#EAB308] text-center">Change</th>
                <th className="py-3 px-6 text-[#EAB308] text-center">Recommendation</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(priceDifferences).map(([days, oldPrice]) => {
                const diff = livePrice - oldPrice;
                const percentageChange = ((diff / oldPrice) * 100).toFixed(2);
                const recommendation = getRecommendation(percentageChange);

                return (
                  <tr key={days} className="border-b border-gray-700 last:border-0 hover:bg-gray-700/50">
                    <td className="py-4 px-6 text-white text-center">{getLabel(days)}</td>
                    <td className="py-4 px-6 text-gray-300 text-center">${oldPrice.toFixed(2)}</td>
                    <td className={`py-4 px-6 text-center ${diff >= 0 ? "text-green-400" : "text-red-400"}`}>
                      ${Math.abs(diff).toFixed(2)}
                    </td>
                    <td className={`py-4 px-6 text-center ${diff >= 0 ? "text-green-400" : "text-red-400"}`}>
                      <div className="flex items-center justify-center">
                        {diff >= 0 ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
                        {percentageChange}%
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center font-bold">{recommendation}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-6 p-4 bg-gray-900 rounded-lg text-white w-full">
          <h3 className="text-lg font-bold text-center mb-2">Market Summary</h3>
          <p className="text-center text-gray-300">
            Current Price: <span className="text-yellow-400">${livePrice?.toFixed(2)}</span>
          </p>
          <p className="text-center text-gray-300">
            Trend: {livePrice > priceDifferences[30] ? (
              <span className="text-green-400">📈 Bullish</span>
            ) : (
              <span className="text-red-400">📉 Bearish</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

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

function getRecommendation(percentageChange) {
  if (percentageChange > 2) {
    return <span className="text-green-400">🟢 BUY</span>;
  } else if (percentageChange < -2) {
    return <span className="text-red-400">🔴 SELL</span>;
  } else {
    return <span className="text-yellow-400">🟡 HOLD</span>;
  }
}
