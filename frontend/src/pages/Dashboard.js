import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { getUser } from '../utils/auth';
import { useNavigate, Link } from 'react-router-dom';

const StarRating = ({ count, value, onChange }) => {
  const stars = [];
  for (let i = 1; i <= count; i++) {
    stars.push(
      <span
        key={i}
        onClick={() => onChange(i)}
        style={{ cursor: 'pointer', color: i <= value ? 'gold' : '#ccc', fontSize: '20px' }}
      >
        ★
      </span>
    );
  }
  return <span>{stars}</span>;
};

const Dashboard = () => {
  const user = getUser();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [ratings, setRatings] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [search, setSearch] = useState('');
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user.role === 'admin') {
          const res = await API.get('/admin/dashboard');
          setData(res.data);
        } else if (user.role === 'store_owner') {
          const res = await API.get('/ratings/store');
          setData(res.data);
        } else {
          const res = await API.get('/stores');
          const userRatings = await API.get('/ratings/user');
          const ratingMap = {};
          userRatings.data.forEach((r) => {
            ratingMap[r.store_id] = r.rating;
          });
          setRatings(ratingMap);
          setData(res.data);
        }
      } catch (err) {
        setLoadError('Failed to load dashboard data. Please try again.');
      }
    };
    fetchData();
  }, [user.role]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleRatingChange = (storeId, value) => {
    setRatings({ ...ratings, [storeId]: value });
  };

  const handleSubmitRating = async (storeId) => {
    const rating = ratings[storeId];
    if (!rating || rating < 1 || rating > 5) {
      setSubmitError('Rating must be between 1 and 5');
      return;
    }
    try {
      await API.post('/ratings', { store_id: storeId, rating });
      setSubmitError('');
      alert('Rating submitted/updated');
    } catch (err) {
      if (err.response?.status === 404) {
        setSubmitError('Store not found.');
      } else {
        setSubmitError('Failed to submit rating');
      }
    }
  };

  const filteredStores =
    user.role === 'user' && data
      ? data
          .filter((store) => store.name.toLowerCase().includes(search.toLowerCase()))
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      : [];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
  <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-6">
    {/* Header */}
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-gray-800">Welcome, {user.role}</h2>
      <div className="flex items-center space-x-4">
        <Link to="/profile" className="text-blue-600 hover:underline font-medium">Profile</Link>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md text-sm"
        >
          Logout
        </button>
      </div>
    </div>

    {loadError && <p className="text-red-500">{loadError}</p>}

    {/* Store Owner Dashboard */}
    {user.role === 'store_owner' && data && (
      <div className="space-y-3">
        <h3 className="text-xl font-semibold">Your Store Ratings</h3>
        <p className="text-gray-700">
  Average Rating:{' '}
  {typeof data.averageRating === 'number'
    ? data.averageRating.toFixed(2)
    : 'N/A'}
</p>

        <ul className="list-disc pl-6">
          {data.ratings.map((entry, idx) => (
            <li key={idx} className="text-gray-700">
              {entry.name} — Rating: {entry.rating}
            </li>
          ))}
        </ul>
      </div>
    )}

    {/* User Dashboard */}
    {user.role === 'user' && (
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4">Explore Stores</h3>
        <input
          type="text"
          placeholder="Search stores..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring focus:ring-blue-200"
        />
        <ul className="space-y-4">
          {filteredStores.map((store) => (
            <li key={store.id} className="p-4 border border-gray-200 rounded-md shadow-sm bg-gray-50">
              <div className="font-semibold text-lg">{store.name}</div>
              <div className="text-sm text-gray-600">{store.address}</div>
              <div className="mt-1 text-sm text-gray-700">Rating: {store.rating || 'N/A'}</div>
              <div className="mt-2">
                <StarRating
                  count={5}
                  value={ratings[store.id] || 0}
                  onChange={(val) => handleRatingChange(store.id, val)}
                />
                <button
                  onClick={() => handleSubmitRating(store.id)}
                  className="ml-4 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                >
                  {ratings[store.id] ? 'Update' : 'Submit'} Rating
                </button>
              </div>
            </li>
          ))}
        </ul>
        {submitError && <p className="text-red-500 mt-2">{submitError}</p>}
      </div>
    )}

    {/* Admin Dashboard */}
    {user.role === 'admin' && data && (
      <div className="mt-6 space-y-2">
        <h3 className="text-xl font-semibold mb-2">Admin Dashboard</h3>
        <p>Total Users: <span className="font-medium text-gray-800">{data.totalUsers}</span></p>
        <p>Total Stores: <span className="font-medium text-gray-800">{data.totalStores}</span></p>
        <p>Total Ratings: <span className="font-medium text-gray-800">{data.totalRatings}</span></p>
      </div>
    )}

    {/* Admin Controls */}
    {user.role === 'admin' && (
      <div className="mt-8">
        <h4 className="text-lg font-semibold mb-2">Admin Controls</h4>
        <ul className="space-y-2">
          <li>
            <Link to="/admin/add-user" className="text-blue-600 hover:underline"> Add User</Link>
          </li>
          <li>
            <Link to="/admin/users" className="text-blue-600 hover:underline"> View Users</Link>
          </li>
          <li>
            <Link to="/admin/stores" className="text-blue-600 hover:underline"> View Stores</Link>
          </li>
        </ul>
      </div>
    )}
  </div>
</div>

  );
};

export default Dashboard;