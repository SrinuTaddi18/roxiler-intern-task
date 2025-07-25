import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { getUser } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const user = getUser();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', address: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [message, setMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get('/auth/profile');
        setForm(res.data);
      } catch (err) {
        setMessage('Failed to load profile.');
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await API.put('/auth/profile', form);
      setMessage('Profile updated successfully.');
    } catch (err) {
      setMessage('Failed to update profile.');
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmNewPassword } = passwordForm;
    if (newPassword !== confirmNewPassword) {
      setPasswordMessage('New passwords do not match.');
      return;
    }
    try {
      await API.put('/auth/password', { currentPassword, newPassword });
      setPasswordMessage('Password updated successfully.');
    } catch (err) {
      setPasswordMessage('Failed to update password.');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your account?')) return;
    try {
      await API.delete('/auth/profile');
      localStorage.removeItem('token');
      navigate('/signup');
    } catch (err) {
      setMessage('Failed to delete account.');
    }
  };

  return (
  <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
  <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile</h2>

  <form onSubmit={handleUpdate} className="space-y-4 mb-8">
    <input
      name="name"
      value={form.name}
      onChange={handleChange}
      placeholder="Name"
      required
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <input
      name="email"
      value={form.email}
      onChange={handleChange}
      placeholder="Email"
      disabled
      className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md"
    />
    <input
      name="address"
      value={form.address}
      onChange={handleChange}
      placeholder="Address"
      required
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <button
      type="submit"
      className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
    >
      Update Profile
    </button>
  </form>

  <h3 className="text-xl font-semibold text-gray-700 mb-4">Change Password</h3>
  <form onSubmit={handlePasswordUpdate} className="space-y-4 mb-6">
    <input
      type="password"
      name="currentPassword"
      placeholder="Current Password"
      value={passwordForm.currentPassword}
      onChange={handlePasswordChange}
      required
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <input
      type="password"
      name="newPassword"
      placeholder="New Password"
      value={passwordForm.newPassword}
      onChange={handlePasswordChange}
      required
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <input
      type="password"
      name="confirmNewPassword"
      placeholder="Confirm New Password"
      value={passwordForm.confirmNewPassword}
      onChange={handlePasswordChange}
      required
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <button
      type="submit"
      className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
    >
      Update Password
    </button>
  </form>

  <button
    onClick={handleDelete}
    className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
  >
    Delete Account
  </button>

  {message && <p className="mt-4 text-green-600">{message}</p>}
  {passwordMessage && <p className="mt-2 text-blue-600">{passwordMessage}</p>}
</div>

  );
};

export default Profile;