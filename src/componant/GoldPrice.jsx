import React from "react";

import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function GoldPriceDashboard() {
  const [livePrice, setLivePrice] = useState(null);
  const [previousPrice, setPreviousPrice] = useState(null);
  const [newYorkTime, setNewYorkTime] = useState(null);
  const [priceDifferences, setPriceDifferences] = useState({
    7: null,
    30: null,
    60: null,
    180: null,
    365: null,
    1825: null,
  });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Live Price and New York Time
  const fetchLivePrice = async () => {
    try {
      const response = await fetch(
        "https://goldbackend-vpte.onrender.com/live"
      );
      const data = await response.json();
      setPreviousPrice(livePrice);
      setLivePrice(data.price);
      setNewYorkTime(data.newYorkTime);
    } catch (error) {
      console.error("Error fetching live price:", error);
    }
  };

  // Fetch Data for Last Entries (Only last two entries)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://goldbackend-vpte.onrender.com/prices");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        // Fetch only the last two entries
        setData(result.slice(-2));
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    fetchLivePrice();
    const interval = setInterval(fetchLivePrice, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex flex-col md:flex-row gap-8 px-8 sm:px-12 mt-2">
      {/* Left: Live Gold Price with Last Entries Data */}
      <div className="w-full md:w-1/2 bg-gray-800 rounded-lg p-8 shadow-xl space-y-6">
        <h2 className="text-2xl font-bold text-yellow-400">Live Gold Price</h2>
        <h3 className="text-lg font-semibold text-gray-300">24K Gold</h3>

        {livePrice ? (
          <div>
            <p className="text-4xl font-bold text-yellow-500">
              ${livePrice.toFixed(2)}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              New York Time:{" "}
              {newYorkTime
                ? new Date(newYorkTime).toLocaleString()
                : "Loading..."}
            </p>
            <div
              className={`flex items-center ${
                previousPrice !== null && livePrice >= previousPrice
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {previousPrice !== null && livePrice >= previousPrice ? (
                <TrendingUp className="mr-4" />
              ) : (
                <TrendingDown className="mr-4" />
              )}
              <span>
                {previousPrice !== null
                  ? (
                      ((livePrice - previousPrice) / previousPrice) *
                      100
                    ).toFixed(2)
                  : "0.00"}
                %
              </span>
            </div>

            {/* Last Entries Table */}
            <table className="w-full mt-4">
              <thead>
                <tr>
                  <th className="py-3 text-left text-yellow-500">DateTime</th>
                  <th className="py-3 text-right text-yellow-500">
                    Gold Price (USD)
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <React.Fragment key={index}>
                    <tr>
                      <td className="text-gray-400 py-2 text-left">{row[0]}</td>
                      <td className="text-yellow-500 py-2 text-right">
                        {row[1]}
                      </td>
                    </tr>
                    {/* Horizontal line between rows */}
                    {index !== data.length - 1 && (
                      <tr>
                        <td colSpan="2">
                          <hr className="border-gray-600 my-4" />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-400">Loading...</p>
        )}
      </div>

      {/* Right: Price Performance Table */}
      <div className="w-full md:w-1/2 bg-gray-800 rounded-lg p-8 shadow-xl space-y-6">
        <h2 className="text-2xl font-bold text-yellow-400">
          Gold Price Performance
        </h2>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="py-3 text-left text-yellow-500">Time Period</th>
              <th className="py-3 text-right text-yellow-500">Price Diff</th>
              <th className="py-3 text-right text-yellow-500">Change</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(priceDifferences).map(([days, diff]) => (
              <tr
                key={days}
                className="border-b border-gray-700 last:border-0 hover:bg-gray-700/50"
              >
                <td className="py-4 text-yellow-500">{getLabel(days)}</td>
                <td
                  className={`text-right py-4 ${
                    diff >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  ${Math.abs(diff || 0).toFixed(2)}
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
                    {livePrice
                      ? ((Math.abs(diff) / (livePrice - diff)) * 100).toFixed(2)
                      : "0.00"}
                    %
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
    180: "Last 6 Months",
    365: "Last Year",
    1825: "Last 5 Years",
  };
  return labels[days] || `${days} Days Ago`;
}
