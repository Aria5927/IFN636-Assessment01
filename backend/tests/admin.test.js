const sinon = require('sinon');
const { expect } = require('chai');
const mongoose = require('mongoose');
const User = require('../models/User');
const { createDoctor, updateDoctorStatus, getAllUsers, deletePatient } = require('../controllers/adminController');

describe('Admin Controller Tests', () => {

    // Test Case 1: Create Doctor Success
    it('should create a doctor account and return 201', async () => {
        const fakeDoctor = {
            id: new mongoose.Types.ObjectId(),
            name: 'Dr. Smith',
            email: 'smith@test.com',
            role: 'Doctor',
            status: 'Active'
        };
        sinon.stub(User, 'findOne').resolves(null);
        sinon.stub(User, 'create').resolves(fakeDoctor);

        const req = {
            body: { name: 'Dr. Smith', email: 'smith@test.com', password: '123456' }
        };
        const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

        await createDoctor(req, res);

        expect(res.status.calledWith(201)).to.be.true;
        User.findOne.restore();
        User.create.restore();
    });

    // Test Case 2: Create Doctor - Already Exists
    it('should return 400 if doctor already exists', async () => {
        sinon.stub(User, 'findOne').resolves({ email: 'smith@test.com' });

        const req = {
            body: { name: 'Dr. Smith', email: 'smith@test.com', password: '123456' }
        };
        const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

        await createDoctor(req, res);

        expect(res.status.calledWith(400)).to.be.true;
        User.findOne.restore();
    });

    // Test Case 3: Update Doctor Status Success
    it('should update doctor status successfully', async () => {
        const fakeDoctor = {
            id: new mongoose.Types.ObjectId(),
            name: 'Dr. Smith',
            email: 'smith@test.com',
            role: 'Doctor',
            status: 'Active',
            save: sinon.stub().resolvesThis()
        };
        sinon.stub(User, 'findOne').resolves(fakeDoctor);

        const req = {
            params: { id: new mongoose.Types.ObjectId().toString() },
            body: { status: 'Inactive' }
        };
        const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

        await updateDoctorStatus(req, res);

        expect(res.json.called).to.be.true;
        User.findOne.restore();
    });

    // Test Case 4: Update Doctor Status - Not Found
    it('should return 404 if doctor not found', async () => {
        sinon.stub(User, 'findOne').resolves(null);

        const req = {
            params: { id: new mongoose.Types.ObjectId().toString() },
            body: { status: 'Inactive' }
        };
        const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

        await updateDoctorStatus(req, res);

        expect(res.status.calledWith(404)).to.be.true;
        User.findOne.restore();
    });

    // Test Case 5: Get All Users Success
    it('should return all doctors and patients', async () => {
        const fakeUsers = [
            { name: 'Dr. Smith', role: 'Doctor' },
            { name: 'John', role: 'Patient' }
        ];
        sinon.stub(User, 'find').returns({
            select: sinon.stub().resolves(fakeUsers)
        });

        const req = {};
        const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

        await getAllUsers(req, res);

        expect(res.json.calledWith(fakeUsers)).to.be.true;
        User.find.restore();
    });

    // Test Case 6: Delete Patient Success
    it('should delete a patient account', async () => {
        const fakePatient = {
            id: new mongoose.Types.ObjectId(),
            name: 'John',
            role: 'Patient',
            deleteOne: sinon.stub().resolves()
        };
        sinon.stub(User, 'findOne').resolves(fakePatient);

        const req = {
            params: { id: new mongoose.Types.ObjectId().toString() }
        };
        const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

        await deletePatient(req, res);

        expect(res.json.calledWithMatch({ message: 'Patient account deleted successfully' })).to.be.true;
        User.findOne.restore();
    });

    // Test Case 7: Delete Patient - Not Found
    it('should return 404 if patient not found', async () => {
        sinon.stub(User, 'findOne').resolves(null);

        const req = {
            params: { id: new mongoose.Types.ObjectId().toString() }
        };
        const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

        await deletePatient(req, res);

        expect(res.status.calledWith(404)).to.be.true;
        User.findOne.restore();
    });

});