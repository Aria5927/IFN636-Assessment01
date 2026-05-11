const sinon = require('sinon');
const { expect } = require('chai');
const mongoose = require('mongoose');
const User = require('../models/User');
const { getDoctorProfile, updateDoctorProfile } = require('../controllers/doctorController');

describe('Doctor Controller Tests', () => {

    // Test Case 1: Get Doctor Profile Success
    it('should return doctor profile', async () => {
        const fakeDoctor = {
            id: new mongoose.Types.ObjectId(),
            name: 'Dr. Smith',
            email: 'smith@test.com',
            role: 'Doctor',
            status: 'Active'
        };
        sinon.stub(User, 'findById').returns({
            select: sinon.stub().resolves(fakeDoctor)
        });

        const req = { user: { _id: fakeDoctor.id } };
        const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

        await getDoctorProfile(req, res);

        expect(res.json.calledWith(fakeDoctor)).to.be.true;
        User.findById.restore();
    });

    // Test Case 2: Get Doctor Profile - Not Found
    it('should return 404 if doctor not found', async () => {
        sinon.stub(User, 'findById').returns({
            select: sinon.stub().resolves(null)
        });

        const req = { user: { _id: new mongoose.Types.ObjectId() } };
        const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

        await getDoctorProfile(req, res);

        expect(res.status.calledWith(404)).to.be.true;
        User.findById.restore();
    });

    // Test Case 3: Update Doctor Profile Success
    it('should update doctor profile successfully', async () => {
        const fakeDoctor = {
            id: new mongoose.Types.ObjectId(),
            name: 'Dr. Smith',
            email: 'smith@test.com',
            role: 'Doctor',
            status: 'Active',
            save: sinon.stub().resolvesThis()
        };
        sinon.stub(User, 'findById').resolves(fakeDoctor);

        const req = {
            user: { _id: fakeDoctor.id },
            body: { name: 'Dr. John' }
        };
        const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

        await updateDoctorProfile(req, res);

        expect(res.json.called).to.be.true;
        User.findById.restore();
    });

    // Test Case 4: Update Doctor Profile - Not Found
    it('should return 404 if doctor not found during update', async () => {
        sinon.stub(User, 'findById').resolves(null);

        const req = {
            user: { _id: new mongoose.Types.ObjectId() },
            body: { name: 'Dr. John' }
        };
        const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

        await updateDoctorProfile(req, res);

        expect(res.status.calledWith(404)).to.be.true;
        User.findById.restore();
    });

});