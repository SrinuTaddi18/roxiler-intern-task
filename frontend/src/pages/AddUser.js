import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

const AddUser = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '', role: 'user' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/admin/add-user', form);
      setMessage('User created successfully');
      setForm({ name: '', email: '', password: '', address: '', role: 'user' });
    } catch (err) {
      setMessage('Failed to create user');
    }
  };

  return (
   <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
  <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Add New User</h2>
  <form onSubmit={handleSubmit} className="space-y-4">
    <input
      name="name"
      value={form.name}
      onChange={handleChange}
      placeholder="Name"
      required
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
    <input
      name="email"
      type="email"
      value={form.email}
      onChange={handleChange}
      placeholder="Email"
      required
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
    <input
      name="password"
      type="password"
      value={form.password}
      onChange={handleChange}
      placeholder="Password"
      required
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
    <input
      name="address"
      value={form.address}
      onChange={handleChange}
      placeholder="Address"
      required
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
    <select
      name="role"
      value={form.role}
      onChange={handleChange}
      className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      <option value="user">User</option>
      <option value="store_owner">Store Owner</option>
      <option value="admin">Admin</option>
    </select>
    <button
      type="submit"
      className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
    >
      Create User
    </button>
  </form>
  {message && (
    <p className="mt-4 text-center text-green-600 font-medium">{message}</p>
  )}
</div>

  );
};

export default AddUser;