import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import Papa from 'papaparse';

export default function GoldPriceDashboard() {
  const [livePrice, setLivePrice] = useState(null);
  const [previousPrice, setPreviousPrice] = useState(null);
  const [priceDifferences, setPriceDifferences] = useState({
    7: null,
    30: null,
    60: null,
    180: null,
    365: null,
    1825: null,
  });
  const [lastTwoEntries, setLastTwoEntries] = useState([]);
  const [newYorkTime, setNewYorkTime] = useState(null);

  // Fetch Live Price and New York Time
  const fetchLivePrice = async () => {
    try {
      const response = await fetch("https://goldbackend-vpte.onrender.com/live");
      const data = await response.json();
      setPreviousPrice(livePrice);
      setLivePrice(data.price);
      setNewYorkTime(data.newYorkTime);
    } catch (error) {
      console.error("Error fetching live price:", error);
    }
  };

  // Fetch Historical Data
  const fetchHistoricalData = async () => {
    try {
      const response = await fetch('https://raw.githubusercontent.com/Parthrk75/gold-price-data/main/gold_prices.csv');
      const csvText = await response.text();
      Papa.parse(csvText, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (result) => {
          if (!result.data || !Array.isArray(result.data)) {
            console.error("Invalid CSV data format.");
            return;
          }
          const sortedData = result.data
            .filter(entry => entry.Date && entry.Close)
            .sort((a, b) => new Date(b.Date) - new Date(a.Date));
          setLastTwoEntries(sortedData.slice(0, 2));
        },
      });
    } catch (error) {
      console.error('Error fetching historical data:', error);
    }
  };

  useEffect(() => {
    fetchLivePrice();
    fetchHistoricalData();
    const interval = setInterval(fetchLivePrice, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col md:flex-row gap-8 px-8 sm:px-12 mt-4">
      {/* Left: Live Gold Price and Historical Entries */}
      <div className="w-full md:w-1/2 bg-gray-800 rounded-lg p-6 md:p-8 shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-yellow-400">Live Gold Price</h2>
        <h3 className="text-lg font-semibold mt-6 text-gray-300">24K Gold</h3>

        {livePrice ? (
          <div>
            <p className="text-4xl font-bold text-yellow-500">${livePrice?.toFixed(2) || "Loading..."}</p>
            <p className="text-sm text-gray-400 mt-2">
              New York Time: {newYorkTime ? new Date(newYorkTime).toLocaleString() : 'Loading...'}
            </p>
            <div className={`flex items-center ${previousPrice !== null && livePrice >= previousPrice ? 'text-green-400' : 'text-red-400'}`}>
              {previousPrice !== null && livePrice >= previousPrice ? <TrendingUp className="mr-4" /> : <TrendingDown className="mr-4" />}
              <span>{previousPrice !== null ? ((livePrice - previousPrice) / previousPrice * 100).toFixed(2) : '0.00'}%</span>
            </div>

            <h3 className="text-lg font-semibold mt-6 text-gray-300">Last Two Entries:</h3>
            <ul className="text-gray-400">
              {lastTwoEntries.length > 0 ? lastTwoEntries.map((entry, index) => (
                <li key={index}>{entry.Date}: ${entry?.Close?.toFixed(2) || "N/A"}</li>
              )) : <li>No historical data available or failed to load CSV.</li>}
            </ul>
          </div>
        ) : (
          <p className="text-gray-400">Loading...</p>
        )}
      </div>

      {/* Right: Price Performance Table */}
      <div className="w-full md:w-1/2 bg-gray-800 rounded-lg p-6 md:p-8 shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-yellow-400">Gold Price Performance</h2>
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
              <tr key={days} className="border-b border-gray-700 last:border-0 hover:bg-gray-700/50">
                <td className="py-4 text-yellow-500">{getLabel(days)}</td>
                <td className={`text-right py-4 ${diff >= 0 ? "text-green-400" : "text-red-400"}`}>
                  ${Math.abs(diff || 0).toFixed(2)}
                </td>
                <td className={`text-right py-4 ${diff >= 0 ? "text-green-400" : "text-red-400"}`}>
                  <div className="flex items-center justify-end">
                    {diff >= 0 ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
                    {livePrice ? ((Math.abs(diff) / (livePrice - diff)) * 100).toFixed(2) : "0.00"}%
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
