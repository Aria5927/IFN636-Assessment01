import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const HealthRecords = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [editingRecord, setEditingRecord] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    patientName: '', age: '', gender: 'Male',
    height: '', weight: '', bloodType: 'A+',
    conditionDetail: '', diagnosis: '', medication: ''
  });

  const fetchRecords = async () => {
    try {
      const response = await axiosInstance.get('/api/records', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setRecords(response.data);
    } catch (error) {
      alert('Failed to fetch records.');
    }
  };

  useEffect(() => { fetchRecords(); }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRecord) {
        await axiosInstance.put(`/api/records/${editingRecord._id}`, form, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
      } else {
        await axiosInstance.post('/api/records', form, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
      }
      setForm({
        patientName: '', age: '', gender: 'Male',
        height: '', weight: '', bloodType: 'A+',
        conditionDetail: '', diagnosis: '', medication: ''
      });
      setEditingRecord(null);
      setShowForm(false);
      fetchRecords();
    } catch (error) {
      alert('Failed to save record.');
    }
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setForm({
      patientName: record.patientName, age: record.age,
      gender: record.gender, height: record.height,
      weight: record.weight, bloodType: record.bloodType,
      conditionDetail: record.conditionDetail, diagnosis: record.diagnosis,
      medication: record.medication
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    try {
      await axiosInstance.delete(`/api/records/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      fetchRecords();
    } catch (error) {
      alert('Failed to delete record.');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-600">Health Records</h1>
        <button
          onClick={() => { setShowForm(!showForm); setEditingRecord(null); }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Add New Record'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white shadow rounded p-6 mb-6 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Patient Name</label>
            <input name="patientName" value={form.patientName} onChange={handleChange}
              className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Age</label>
            <input name="age" type="number" value={form.age} onChange={handleChange}
              className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Gender</label>
            <select name="gender" value={form.gender} onChange={handleChange}
              className="w-full border rounded px-3 py-2">
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Blood Type</label>
            <select name="bloodType" value={form.bloodType} onChange={handleChange}
              className="w-full border rounded px-3 py-2">
              {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(bt => (
                <option key={bt}>{bt}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Height (cm)</label>
            <input name="height" type="number" value={form.height} onChange={handleChange}
              className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Weight (kg)</label>
            <input name="weight" type="number" value={form.weight} onChange={handleChange}
              className="w-full border rounded px-3 py-2" required />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Condition Detail</label>
            <textarea name="conditionDetail" value={form.conditionDetail} onChange={handleChange}
              className="w-full border rounded px-3 py-2" rows="2" required />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Diagnosis</label>
            <textarea name="diagnosis" value={form.diagnosis} onChange={handleChange}
              className="w-full border rounded px-3 py-2" rows="2" required />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Medication</label>
            <input name="medication" value={form.medication} onChange={handleChange}
              className="w-full border rounded px-3 py-2" />
          </div>
          <div className="col-span-2">
            <button type="submit"
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
              {editingRecord ? 'Update Record' : 'Create Record'}
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-4">
        {records.length === 0 ? (
          <p className="text-gray-500">No records found.</p>
        ) : (
          records.map(record => (
            <div key={record._id} className="bg-white shadow rounded p-4 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold">{record.patientName}</h2>
                <p className="text-gray-600">Age: {record.age} | Gender: {record.gender} | Blood Type: {record.bloodType}</p>
                <p className="text-gray-600">Height: {record.height}cm | Weight: {record.weight}kg</p>
                <p className="mt-2"><span className="font-medium">Condition:</span> {record.conditionDetail}</p>
                
                <p><span className="font-medium">Diagnosis:</span> {record.diagnosis}</p>
                {record.medication && <p><span className="font-medium">Medication:</span> {record.medication}</p>}
                <p className="text-gray-400 text-sm">Created by: Dr.{record.userId?.name || 'Unknown'}</p>
              </div>
              <div className="flex gap-2 ml-4">
                {(record.userId?._id === user.id || record.userId == user.id) && (
                  <>
                    <button onClick={() => handleEdit(record)}
                      className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(record._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HealthRecords;