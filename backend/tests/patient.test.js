const sinon = require('sinon');
const { expect } = require('chai');
const mongoose = require('mongoose');
const User = require('../models/User');
const { getPatientProfile, updatePatientProfile, deactivateAccount } = require('../controllers/patientController');

describe('Patient Controller Tests', () => {

    // Test Case 1: Get Patient Profile Success
    it('should return patient profile', async () => {
        const fakePatient = {
            id: new mongoose.Types.ObjectId(),
            name: 'John',
            email: 'john@test.com',
            role: 'Patient',
            status: 'Active'
        };
        sinon.stub(User, 'findById').returns({
            select: sinon.stub().resolves(fakePatient)
        });

        const req = { user: { _id: fakePatient.id } };
        const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

        await getPatientProfile(req, res);

        expect(res.json.calledWith(fakePatient)).to.be.true;
        User.findById.restore();
    });

    // Test Case 2: Get Patient Profile - Not Found
    it('should return 404 if patient not found', async () => {
        sinon.stub(User, 'findById').returns({
            select: sinon.stub().resolves(null)
        });

        const req = { user: { _id: new mongoose.Types.ObjectId() } };
        const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

        await getPatientProfile(req, res);

        expect(res.status.calledWith(404)).to.be.true;
        User.findById.restore();
    });

    // Test Case 3: Update Patient Profile Success
    it('should update patient profile successfully', async () => {
        const fakePatient = {
            id: new mongoose.Types.ObjectId(),
            name: 'John',
            email: 'john@test.com',
            role: 'Patient',
            status: 'Active',
            save: sinon.stub().resolvesThis()
        };
        sinon.stub(User, 'findById').resolves(fakePatient);

        const req = {
            user: { _id: fakePatient.id },
            body: { name: 'John Updated' }
        };
        const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

        await updatePatientProfile(req, res);

        expect(res.json.called).to.be.true;
        User.findById.restore();
    });

    // Test Case 4: Update Patient Profile - Not Found
    it('should return 404 if patient not found during update', async () => {
        sinon.stub(User, 'findById').resolves(null);

        const req = {
            user: { _id: new mongoose.Types.ObjectId() },
            body: { name: 'John Updated' }
        };
        const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

        await updatePatientProfile(req, res);

        expect(res.status.calledWith(404)).to.be.true;
        User.findById.restore();
    });

    // Test Case 5: Deactivate Account Success
    it('should deactivate patient account successfully', async () => {
        const fakePatient = {
            id: new mongoose.Types.ObjectId(),
            name: 'John',
            status: 'Active',
            save: sinon.stub().resolvesThis()
        };
        sinon.stub(User, 'findById').resolves(fakePatient);

        const req = { user: { _id: fakePatient.id } };
        const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

        await deactivateAccount(req, res);

        expect(res.json.calledWithMatch({ message: 'Account deactivated successfully' })).to.be.true;
        User.findById.restore();
    });

    // Test Case 6: Deactivate Account - Not Found
    it('should return 404 if patient not found during deactivation', async () => {
        sinon.stub(User, 'findById').resolves(null);

        const req = { user: { _id: new mongoose.Types.ObjectId() } };
        const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

        await deactivateAccount(req, res);

        expect(res.status.calledWith(404)).to.be.true;
        User.findById.restore();
    });

});