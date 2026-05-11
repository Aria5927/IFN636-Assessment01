const sinon = require('sinon');
const { expect } = require('chai');
const mongoose = require('mongoose');
const User = require('../models/User');
const { registerUser, loginUser } = require('../controllers/authController');
const bcrypt = require('bcrypt');

describe('Auth Controller Tests', () => {

    // Test Case 1: Register Success
    it('should register a new user and return 201', async () => {
        const fakeUser = {
            id: new mongoose.Types.ObjectId(),
            name: 'John',
            email: 'john@test.com',
            role: 'Patient'
        };
        sinon.stub(User, 'findOne').resolves(null);
        sinon.stub(User, 'create').resolves(fakeUser);

        const req = {
            body: { name: 'John', email: 'john@test.com', password: '123456', role: 'Patient' }
        };
        const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

        await registerUser(req, res);

        expect(res.status.calledWith(201)).to.be.true;
        User.findOne.restore();
        User.create.restore();
    });

    // Test Case 2: Register - User Already Exists
    it('should return 400 if user already exists', async () => {
        sinon.stub(User, 'findOne').resolves({ email: 'john@test.com' });

        const req = {
            body: { name: 'John', email: 'john@test.com', password: '123456', role: 'Patient' }
        };
        const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

        await registerUser(req, res);

        expect(res.status.calledWith(400)).to.be.true;
        User.findOne.restore();
    });

    // Test Case 3: Register - Admin cannot self-register
    it('should return 403 if role is Admin', async () => {
        sinon.stub(User, 'findOne').resolves(null);

        const req = {
            body: { name: 'Admin', email: 'admin@test.com', password: '123456', role: 'Admin' }
        };
        const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

        await registerUser(req, res);

        expect(res.status.calledWith(403)).to.be.true;
        User.findOne.restore();
    });

    // Test Case 4: Login Success
    it('should login successfully and return token', async () => {
        const hashedPassword = await bcrypt.hash('123456', 10);
        const fakeUser = {
            id: new mongoose.Types.ObjectId(),
            name: 'John',
            email: 'john@test.com',
            role: 'Patient',
            password: hashedPassword
        };
        sinon.stub(User, 'findOne').resolves(fakeUser);

        const req = {
            body: { email: 'john@test.com', password: '123456' }
        };
        const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

        await loginUser(req, res);

        expect(res.json.called).to.be.true;
        User.findOne.restore();
    });

    // Test Case 5: Login - Invalid credentials
    it('should return 401 if credentials are invalid', async () => {
        sinon.stub(User, 'findOne').resolves(null);

        const req = {
            body: { email: 'wrong@test.com', password: 'wrongpassword' }
        };
        const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

        await loginUser(req, res);

        expect(res.status.calledWith(401)).to.be.true;
        User.findOne.restore();
    });

});