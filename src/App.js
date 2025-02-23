import React from "react";
import { Routes, Route } from "react-router-dom"; // ❌ Removed extra Router
import { Helmet } from "react-helmet-async";
import "./App.css";
import GoldCard from "./components/GoldCard";
import Navbar from "./components/Navbar";
import Blog from "./components/Blog";
import BlogDetail from "./components/BlogDetail";

function App() {
  return (
    <div>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>Today Gold Prices - Live Gold Rate Updates</title>
        <meta name="description" content="Get the latest gold prices and market trends. Stay updated with live gold rates and historical data." />
        <meta name="keywords" content="gold price, live gold rate, gold market, gold trends, gold investment, gold updates" />
        <meta name="author" content="YourWebsiteName" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.todaygoldprices.org/" />

        {/* Open Graph Meta Tags (for social media) */}
        <meta property="og:title" content="Today Gold Prices - Live Gold Rate Updates" />
        <meta property="og:description" content="Check the latest gold prices, trends, and historical data. Stay informed about the gold market." />
        <meta property="og:image" content="https://www.todaygoldprices.org/og-image.jpg" />
        <meta property="og:url" content="https://www.todaygoldprices.org/" />
        <meta property="og:type" content="website" />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Today Gold Prices - Live Gold Rate Updates" />
        <meta name="twitter:description" content="Stay updated with live gold rates and market trends. Check real-time gold price updates." />
        <meta name="twitter:image" content="https://www.todaygoldprices.org/twitter-image.jpg" />
      </Helmet>

      {/* Website Content */}
      <Navbar />

      <Routes>
        <Route path="/" element={<GoldCard />} />
        <Route path="/blog" element={<Blog />} /> {/* Blog Page Route */}
        <Route path="/blog/:title" element={<BlogDetail />} />
      </Routes>
    </div>
  );
}

export default App;
