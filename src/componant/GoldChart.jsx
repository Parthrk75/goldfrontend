import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler
);

const formatDate = (dateString, selectedTimeframe) => {
  const [datePart] = dateString.split(" ");
  const [day, month, year] = datePart.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return ["7d", "30d", "60d"].includes(selectedTimeframe)
    ? `${parseInt(day, 10)} ${months[parseInt(month, 10) - 1]}`
    : `${months[parseInt(month, 10) - 1]} ${year}`;
};

const filterDataPoints = (data, selectedTimeframe) => {
  if (selectedTimeframe === "7d") return data.slice(-7);
  if (selectedTimeframe === "30d") return data.slice(-30);

  let step = 1;
  if (selectedTimeframe === "180d") step = 7;
  if (selectedTimeframe === "365d") step = 14;
  if (selectedTimeframe === "1825d") step = 30;

  return data.filter((_, index) => index % step === 0);
};

const GoldChart = () => {
  const [goldPrices, setGoldPrices] = useState([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState("7d");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGoldPrices = async () => {
      setIsLoading(true);
      let apiUrl = `https://goldbackend-f70034eb64ad.herokuapp.com/last-entries`;
      if (selectedTimeframe !== "7d") {
        apiUrl += `?numEntries=${selectedTimeframe.replace("d", "")}`;
      }

      try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid data format received");
        }

        const parsedData = data.map((entry) => {
          if (typeof entry === "string") {
            const [timestamp, open, high, low, close] = entry.split(",");
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
        console.error("Error fetching gold prices:", error);
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
    { label: "7D", value: "7d" },
    { label: "1M", value: "30d" },
    { label: "2M", value: "60d" },
    { label: "6M", value: "180d" },
    { label: "1Y", value: "365d" },
    { label: "5Y", value: "1825d" },
  ];

  const filteredData = filterDataPoints(goldPrices, selectedTimeframe);

  const chartData = {
    labels: filteredData.map((item) => formatDate(item.timestamp, selectedTimeframe)),
    datasets: [
      {
        data: filteredData.map((item) => item.close),
        fill: "start",
        borderColor: "rgb(255, 215, 0)",
        backgroundColor: "rgba(255, 215, 0, 0.2)",
        borderWidth: 3,
        tension: 0.4,
        pointRadius: 3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: ["7d", "30d", "60d"].includes(selectedTimeframe) ? "Days" : "Months",
          color: "#fff",
          font: { size: 14, weight: "bold" },
        },
        ticks: {
          color: "#fff",
          maxTicksLimit: selectedTimeframe === "1825d" ? 12 : selectedTimeframe === "365d" ? 6 : 5,
        },
      },
      y: {
        title: {
          display: true,
          text: "$",
          color: "#fff",
          font: { size: 14, weight: "bold" },
        },
        ticks: { color: "#fff" },
      },
    },
  };

  return (
    <div >
      <div className="flex flex-wrap items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-white">Gold Price Chart</h2>
        <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
          {timeframes.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setSelectedTimeframe(value)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                selectedTimeframe === value ? "bg-yellow-500 text-gray-900" : "text-gray-400 hover:text-white hover:bg-gray-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="relative h-72 sm:h-96 w-full">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default GoldChart;
