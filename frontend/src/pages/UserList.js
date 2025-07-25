import React, { useEffect, useState } from 'react';
import API from '../services/api';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get('/admin/users');
         console.log('User data:', res.data); // ✅ Add this
        setUsers(res.data);
      } catch (err) {
        console.error('Failed to fetch users');
      }
    };
    fetchUsers();
  }, []);

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.address.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
  <h2 className="text-2xl font-semibold mb-4 text-gray-800">All Users</h2>

  <input
    type="text"
    placeholder="Search users..."
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
          <th className="px-4 py-2 border-b">Role</th>
          <th className="px-4 py-2 border-b">Avg Rating</th>
        </tr>
      </thead>
      <tbody>
        {filtered.map((u) => (
          <tr key={u.id} className="hover:bg-gray-50">
            <td className="px-4 py-2 border-b">{u.name}</td>
            <td className="px-4 py-2 border-b">{u.email}</td>
            <td className="px-4 py-2 border-b">{u.address}</td>
            <td className="px-4 py-2 border-b capitalize">{u.role}</td>
            <td className="px-4 py-2 border-b text-center">
              {u.role === 'store_owner'
                ? u.averageRating !== null && !isNaN(u.averageRating)
                  ? Number(u.averageRating).toFixed(2)
                  : 'N/A'
                : '-'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

  );
};

export default UserList;
