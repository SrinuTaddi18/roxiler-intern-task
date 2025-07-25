import React, { useEffect, useState } from 'react';
import API from '../services/api';

const StoreDashboard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get('/ratings/store');
        setData(res.data);
      } catch (err) {
        setError('Failed to load store ratings');
      }
    };
    fetchData();
  }, []);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h2>Your Store Dashboard</h2>
      <p><strong>Average Rating:</strong> {data.averageRating?.toFixed(2) ?? 'N/A'}</p>
      <h3>Rated By Users</h3>
      <ul>
        {data.ratings.map((entry, i) => (
          <li key={i}>
            {entry.name} — Rating: {entry.rating}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StoreDashboard;