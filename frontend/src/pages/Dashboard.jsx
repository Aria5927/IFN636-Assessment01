import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recordCount, setRecordCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await axiosInstance.get('/api/records', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setRecordCount(response.data.length);
      } catch (error) {
        console.error('Failed to fetch records');
      }
    };
    fetchCount();
  }, [user]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-2">Welcome, Dr. {user?.name} 👋</h1>
      <p className="text-gray-500 mb-8">Health Record Management System</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-6 border-l-4 border-blue-500">
          <p className="text-gray-500 text-sm">Total Patient Records</p>
          <p className="text-4xl font-bold text-blue-600 mt-2">{recordCount}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6 border-l-4 border-green-500">
          <p className="text-gray-500 text-sm">Logged in as</p>
          <p className="text-xl font-bold text-green-600 mt-2">{user?.email}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6 border-l-4 border-purple-500">
          <p className="text-gray-500 text-sm">Role</p>
          <p className="text-xl font-bold text-purple-600 mt-2">Doctor</p>
        </div>
      </div>

      <button
        onClick={() => navigate('/records')}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 text-lg"
      >
        Manage Health Records →
      </button>
    </div>
  );
};

export default Dashboard;