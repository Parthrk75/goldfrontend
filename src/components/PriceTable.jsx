import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function PriceTable() {
  const [livePrice, setLivePrice] = useState(null);
  const [priceDifferences, setPriceDifferences] = useState({
    7: null,
    30: null,
    60: null,
    180: null,
    365: null,
    1825: null,
  });

  // Map for better label naming
  const timeLabels = {
    7: "Last Week",
    30: "Last Month",
    60: "Last 2 Months",
    180: "Last 6 Months",
    365: "Last Year",
    1825: "Last 5 Years",
  };

  // Fetch live price and historical data
  useEffect(() => {
    // Fetch live price
    fetch("https://goldbackend-vpte.onrender.com/live")
      .then((response) => response.json())
      .then((data) => {
        setLivePrice(data.price);
      })
      .catch((error) => console.error("Error fetching live price:", error));

    // Fetch historical prices
    const fetchHistoricalData = (numEntries) => {
      fetch(
        `https://goldbackend-vpte.onrender.com/last-entries?numEntries=${numEntries}`
      )
        .then((response) => response.json())
        .then((data) => {
          const relevantEntry = numEntries === 1825 ? data[1] : data[0];
          const historicalPrice = parseFloat(
            relevantEntry.split(",")[4] // Extract 'Close' price
          );
          const priceDifference =
            livePrice !== null ? livePrice - historicalPrice : null;
          setPriceDifferences((prev) => ({
            ...prev,
            [numEntries]: priceDifference,
          }));
        })
        .catch((error) =>
          console.error(`Error fetching data for ${numEntries} days:`, error)
        );
    };

    if (livePrice !== null) {
      fetchHistoricalData(7);
      fetchHistoricalData(30);
      fetchHistoricalData(60);
      fetchHistoricalData(180);
      fetchHistoricalData(365);
      fetchHistoricalData(1825);
    }
  }, [livePrice]);

  return (
    <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden mx-20 mt-8">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-yellow-500">
          Gold Price Performance USD
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-yellow-500">Time Period</th>
                <th className="text-right py-3 px-4 text-yellow-500">Price Difference</th>
                <th className="text-right py-3 px-4 text-yellow-500">Change</th>
              </tr>
            </thead>
            <tbody>
              {livePrice !== null &&
              Object.entries(priceDifferences).some(([, difference]) => difference !== null) ? (
                Object.entries(priceDifferences).map(([period, difference]) => (
                  <tr
                    key={period}
                    className="border-b border-gray-700 last:border-0 hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="py-4 px-4 text-yellow-500">{timeLabels[period]}</td>
                    <td
                      className={`text-right py-4 px-4 ${difference >= 0 ? "text-green-400" : "text-red-400"}`}
                    >
                      ${Math.abs(difference).toFixed(2)}
                    </td>
                    <td
                      className={`text-right py-4 px-4 ${difference >= 0 ? "text-green-400" : "text-red-400"}`}
                    >
                      <div className="flex items-center justify-end">
                        {difference >= 0 ? (
                          <TrendingUp size={16} className="mr-1" />
                        ) : (
                          <TrendingDown size={16} className="mr-1" />
                        )}
                        {((Math.abs(difference) / (livePrice - difference)) * 100).toFixed(2)}%
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-4 px-4 text-gray-400">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
