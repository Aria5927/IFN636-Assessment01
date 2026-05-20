const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const User = require('./models/User');

const seed = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    
    const adminPassword = 'test123456';
    const doctorPassword = 'test123456';
    const patientPassword = 'test123456';

    // Admin
    await User.create({
        name: 'Test Admin',
        email: 'admin@test.com',
        password: adminPassword,
        role: 'Admin',
        status: 'Active'
    });

    // Doctors
    const doctors = [
        { name: 'Test Doctor', email: 'doctor@test.com' },
        { name: 'Doctor 01',   email: 'doctor01@test.com' },
        { name: 'Doctor 02',   email: 'doctor02@test.com' },
        { name: 'Doctor 03',   email: 'doctor03@test.com' },
        { name: 'Doctor 04',   email: 'doctor04@test.com' },
        { name: 'Doctor 05',   email: 'doctor05@test.com' },
    ];

    for (const doc of doctors) {
        await User.create({
            name: doc.name,
            email: doc.email,
            password: doctorPassword,
            role: 'Doctor',
            status: 'Active'
        });
    }

    // Patients
    const patients = [
        { name: 'Patient 01', email: 'patient1@test.com' },
        { name: 'Patient 02', email: 'patient2@test.com' },
        { name: 'Patient 03', email: 'patient3@test.com' },
        { name: 'Patient 04', email: 'patient4@test.com' },
        { name: 'Patient 05', email: 'patient5@test.com' },
    ];

    for (const patient of patients) {
        await User.create({
            name: patient.name,
            email: patient.email,
            password: patientPassword,
            role: 'Patient',
            status: 'Active'
        });
    }

    console.log('Admin + 6 Doctors + 5 Patients created!');
    mongoose.disconnect();
};

seed();