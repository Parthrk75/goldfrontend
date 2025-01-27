import React, { useState, useEffect } from 'react';

const LastEntries = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetching data from the backend
    fetch('https://goldbackend-vpte.onrender.com/last-entries')
      .then(response => response.json())
      .then(data => {
        setEntries(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Error fetching data');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Last Gold Price Entries</h1>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Close Price</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr key={index}>
              <td>{entry.Date}</td>
              <td>{entry.Close}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LastEntries;
