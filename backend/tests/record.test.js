const sinon = require('sinon');
const { expect } = require('chai');
const mongoose = require('mongoose');
const HealthRecord = require('../models/HealthRecord');
const { getRecords, createRecord, updateRecord, deleteRecord, getStats } = require('../controllers/recordController');

describe('HealthRecord Controller Tests', () => {

    // Test Case 1: Get All Records - Doctor role
    it('should return all health records for Doctor', async () => {
        const fakeRecords = [
            { patientName: 'John', age: 30, gender: 'Male', bloodType: 'A+', height: 170, weight: 70, conditionDetail: 'Fever', diagnosis: 'Flu', medication: 'Rest' }
        ];
        const findStub = sinon.stub(HealthRecord, 'find').returns({
            populate: sinon.stub().resolves(fakeRecords)
        });
        const req = { user: { _id: new mongoose.Types.ObjectId(), role: 'Doctor' }, query: {} };
        const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

        await getRecords(req, res);

        expect(res.json.calledWith(fakeRecords)).to.be.true;
        findStub.restore();
    });

    // Test Case 2: Get Records - Patient role (own records only)
    it('should return only own records for Patient', async () => {
        const patientId = new mongoose.Types.ObjectId();
        const fakeRecords = [
            { patientName: 'John', userId: patientId }
        ];
        const findStub = sinon.stub(HealthRecord, 'find').returns({
            populate: sinon.stub().resolves(fakeRecords)
        });
        const req = { user: { _id: patientId, role: 'Patient' }, query: {} };
        const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

        await getRecords(req, res);

        expect(res.json.calledWith(fakeRecords)).to.be.true;
        findStub.restore();
    });

    // Test Case 3: Create Record Success
    it('should create a health record and return 201', async () => {
        const createdRecord = {
            _id: new mongoose.Types.ObjectId(),
            patientName: 'Jane', age: 25, gender: 'Female',
            bloodType: 'B+', height: 160, weight: 55,
            conditionDetail: 'Cough', diagnosis: 'Cold', medication: 'Rest'
        };
        const createStub = sinon.stub(HealthRecord, 'create').resolves(createdRecord);
        const req = {
            user: { _id: new mongoose.Types.ObjectId(), role: 'Doctor' },
            body: { patientName: 'Jane', age: 25, gender: 'Female', bloodType: 'B+', height: 160, weight: 55, conditionDetail: 'Cough', diagnosis: 'Cold', medication: 'Rest' }
        };
        const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

        await createRecord(req, res);

        expect(res.status.calledWith(201)).to.be.true;
        expect(res.json.calledWith(createdRecord)).to.be.true;
        createStub.restore();
    });

    // Test Case 4: Create Record Error
    it('should return 500 if create fails', async () => {
        const createStub = sinon.stub(HealthRecord, 'create').throws(new Error('DB Error'));
        const req = {
            user: { _id: new mongoose.Types.ObjectId(), role: 'Doctor' },
            body: { patientName: 'Jane' }
        };
        const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

        await createRecord(req, res);

        expect(res.status.calledWith(500)).to.be.true;
        createStub.restore();
    });

    // Test Case 5: Update Record Success
    it('should update a health record and return updated record', async () => {
        const updatedRecord = {
            _id: new mongoose.Types.ObjectId(),
            patientName: 'John', diagnosis: 'Updated Diagnosis'
        };
        const updateStub = sinon.stub(HealthRecord, 'findOneAndUpdate').resolves(updatedRecord);
        const req = {
            user: { _id: new mongoose.Types.ObjectId(), role: 'Doctor' },
            params: { id: new mongoose.Types.ObjectId().toString() },
            body: { diagnosis: 'Updated Diagnosis' }
        };
        const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

        await updateRecord(req, res);

        expect(res.json.calledWith(updatedRecord)).to.be.true;
        updateStub.restore();
    });

    // Test Case 6: Update Record Not Found
    it('should return 404 if record to update is not found', async () => {
        const updateStub = sinon.stub(HealthRecord, 'findOneAndUpdate').resolves(null);
        const req = {
            user: { _id: new mongoose.Types.ObjectId(), role: 'Doctor' },
            params: { id: new mongoose.Types.ObjectId().toString() },
            body: { diagnosis: 'Updated Diagnosis' }
        };
        const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

        await updateRecord(req, res);

        expect(res.status.calledWith(404)).to.be.true;
        updateStub.restore();
    });

    // Test Case 7: Delete Record Success
    it('should delete a health record', async () => {
        const deleteStub = sinon.stub(HealthRecord, 'findOneAndDelete').resolves({ _id: 'someId' });
        const req = {
            user: { _id: new mongoose.Types.ObjectId(), role: 'Admin' },
            params: { id: new mongoose.Types.ObjectId().toString() }
        };
        const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

        await deleteRecord(req, res);

        expect(res.json.calledWithMatch({ message: 'Record deleted' })).to.be.true;
        deleteStub.restore();
    });

    // Test Case 8: Delete Record Not Found
    it('should return 404 if record to delete is not found', async () => {
        const deleteStub = sinon.stub(HealthRecord, 'findOneAndDelete').resolves(null);
        const req = {
            user: { _id: new mongoose.Types.ObjectId(), role: 'Admin' },
            params: { id: new mongoose.Types.ObjectId().toString() }
        };
        const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

        await deleteRecord(req, res);

        expect(res.status.calledWith(404)).to.be.true;
        deleteStub.restore();
    });

    // Test Case 9: Get Stats Success
    it('should return statistics', async () => {
        const countStub = sinon.stub(HealthRecord, 'countDocuments').resolves(10);
        const aggregateStub = sinon.stub(HealthRecord, 'aggregate').resolves([]);

        const req = { user: { role: 'Doctor' } };
        const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

        await getStats(req, res);

        expect(res.json.called).to.be.true;
        countStub.restore();
        aggregateStub.restore();
    });

});