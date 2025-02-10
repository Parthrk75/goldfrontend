import React from 'react';
import './App.css';
import GoldCard from './components/GoldCard'; // Corrected folder name
import Navbar from './components/Navbar';

function App() {
  return (
    <div>
      {/* SEO Meta Tags */}
      <head>
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
      </head>

      {/* Website Content */}
      <Navbar />
      <GoldCard /> 
    </div>
  );
}

export default App;
