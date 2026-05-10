const User = require('../models/User');

const getDoctorProfile = async (req, res) => {
    try {
        const doctor = await User.findById(req.user._id).select('-password');
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.json(doctor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateDoctorProfile = async (req, res) => {
    try {
        const doctor = await User.findById(req.user._id);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        const { name, email } = req.body;
        doctor.name = name || doctor.name;
        doctor.email = email || doctor.email;

        const updatedDoctor = await doctor.save();
        res.json({
            id: updatedDoctor.id,
            name: updatedDoctor.name,
            email: updatedDoctor.email,
            role: updatedDoctor.role,
            status: updatedDoctor.status
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getDoctorProfile, updateDoctorProfile };