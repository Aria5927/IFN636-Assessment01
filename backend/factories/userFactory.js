class PatientUser {
    constructor(name, email, password) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = 'Patient';
        this.status = 'Active';
    }
}

class DoctorUser {
    constructor(name, email, password, licenseNumber, department) {
        if (!licenseNumber || !department) {
            throw new Error('Doctor registration requires licenseNumber and department');
        }
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = 'Doctor';
        this.status = 'Active';
        this.licenseNumber = licenseNumber;
        this.department = department;
    }
}

class UserFactory {
    static createUser(role, data) {
        switch (role) {
            case 'Patient':
                return new PatientUser(data.name, data.email, data.password);
            case 'Doctor':
                return new DoctorUser(data.name, data.email, data.password, data.licenseNumber, data.department);
            default:
                throw new Error(`Invalid role: ${role}`);
        }
    }
}

module.exports = UserFactory;