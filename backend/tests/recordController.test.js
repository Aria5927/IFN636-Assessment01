const sinon = require('sinon');
const { expect } = require('chai');
const mongoose = require('mongoose');
const HealthRecord = require('../models/HealthRecord');
const { getRecords, createRecord, deleteRecord, updateRecord } = require('../controllers/recordController');

describe('HealthRecord Controller Tests', () => {

  // Test Case 1: Get All Records Success
  it('should return all health records', async () => {
    const fakeRecords = [
      { patientName: 'John', age: 30, gender: 'Male', bloodType: 'A+', height: 170, weight: 70, conditionDetail: 'Fever', diagnosis: 'Flu', medication: 'Rest' }
    ];
    const findStub = sinon.stub(HealthRecord, 'find').returns({
      populate: sinon.stub().resolves(fakeRecords)
    });
    const req = { user: { _id: new mongoose.Types.ObjectId() } };
    const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

    await getRecords(req, res);

    expect(res.json.calledWith(fakeRecords)).to.be.true;
    findStub.restore();
  });

  // Test Case 2: Create Record Success
  it('should create a health record and return 201', async () => {
    const createdRecord = {
      _id: new mongoose.Types.ObjectId(),
      patientName: 'Jane', age: 25, gender: 'Female',
      bloodType: 'B+', height: 160, weight: 55,
      conditionDetail: 'Cough', diagnosis: 'Cold', medication: 'Rest'
    };
    const createStub = sinon.stub(HealthRecord, 'create').resolves(createdRecord);
    const req = {
      user: { _id: new mongoose.Types.ObjectId() },
      body: { patientName: 'Jane', age: 25, gender: 'Female', bloodType: 'B+', height: 160, weight: 55, conditionDetail: 'Cough', diagnosis: 'Cold', medication: 'Rest' }
    };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await createRecord(req, res);

    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(createdRecord)).to.be.true;
    createStub.restore();
  });

  // Test Case 3: Create Record Error
  it('should return 500 if create fails', async () => {
    const createStub = sinon.stub(HealthRecord, 'create').throws(new Error('DB Error'));
    const req = {
      user: { _id: new mongoose.Types.ObjectId() },
      body: { patientName: 'Jane' }
    };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await createRecord(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    createStub.restore();
  });

  // Test Case 4: Delete Record Success
  it('should delete a health record', async () => {
    const deleteStub = sinon.stub(HealthRecord, 'findOneAndDelete').resolves({ _id: 'someId' });
    const req = {
      user: { _id: new mongoose.Types.ObjectId() },
      params: { id: new mongoose.Types.ObjectId().toString() }
    };
    const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

    await deleteRecord(req, res);

    expect(res.json.calledWithMatch({ message: 'Record deleted' })).to.be.true;
    deleteStub.restore();
  });

});