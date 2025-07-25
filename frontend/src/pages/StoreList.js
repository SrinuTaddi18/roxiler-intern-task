import React, { useEffect, useState } from 'react';
import API from '../services/api';

const StoreList = () => {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await API.get('/admin/stores');
        setStores(res.data);
      } catch (err) {
        console.error('Failed to fetch stores');
      }
    };
    fetchStores();
  }, []);

  const filtered = stores.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    s.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
   <div className="max-w-6xl mx-auto mt-10 px-4">
  <h2 className="text-2xl font-semibold mb-4 text-gray-800">All Stores</h2>

  <input
    type="text"
    placeholder="Search stores..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full mb-6 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
  />

  <div className="overflow-x-auto">
    <table className="min-w-full bg-white border border-gray-200 rounded-md shadow-sm">
      <thead className="bg-gray-100 text-gray-700 text-left">
        <tr>
          <th className="px-4 py-2 border-b">Name</th>
          <th className="px-4 py-2 border-b">Email</th>
          <th className="px-4 py-2 border-b">Address</th>
          <th className="px-4 py-2 border-b">Rating</th>
        </tr>
      </thead>
      <tbody>
        {filtered.map((s) => (
          <tr key={s.id} className="hover:bg-gray-50">
            <td className="px-4 py-2 border-b">{s.name}</td>
            <td className="px-4 py-2 border-b">{s.email}</td>
            <td className="px-4 py-2 border-b">{s.address}</td>
            <td className="px-4 py-2 border-b text-center">
              {s.rating != null ? Number(s.rating).toFixed(2) : 'N/A'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

  );
};

export default StoreList;