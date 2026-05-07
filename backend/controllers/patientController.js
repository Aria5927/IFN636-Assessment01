const User = require('../models/User');

const getPatientProfile = async (req, res) => {
    try {
        const patient = await User.findById(req.user._id).select('-password');
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.json(patient);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updatePatientProfile = async (req, res) => {
    try {
        const patient = await User.findById(req.user._id);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        const { name, email } = req.body;
        patient.name = name || patient.name;
        patient.email = email || patient.email;

        const updatedPatient = await patient.save();
        res.json({
            id: updatedPatient.id,
            name: updatedPatient.name,
            email: updatedPatient.email,
            role: updatedPatient.role,
            status: updatedPatient.status
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deactivateAccount = async (req, res) => {
    try {
        const patient = await User.findById(req.user._id);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        patient.status = 'Inactive';
        await patient.save();

        res.json({ message: 'Account deactivated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getPatientProfile, updatePatientProfile, deactivateAccount };