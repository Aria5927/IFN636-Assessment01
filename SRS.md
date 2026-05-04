# Software Requirements Specification (SRS)
## Health Record Management System

| Field | Details |
|---|---|
| **Project Title** | Health Record Management System |
| **Version** | 1.0
| **Date** | April 2026 |
| **Unit** | IFN636 |

---

## Table of Contents

1. [Project Overview and Purpose](#1-Project-Overview-and-Purpose)
2. [Problem Statement and Scope](#2-Problem-Statement-and-Scope)
3. [User Characteristics](#3-User-Characteristics)
4. [Constraints](#4-Constraints)
5. [Functional Requirements](#5-Functional-Requirements)
6. [Non-Functional Requirement](#6-Non-Functional-Requirement)
7. [API Specification](#7-api-specification)
8. [Constraints and Assumptions](#8-constraints-and-assumptions)

---

## 1. Project Overview and Purpose

The Health Record Management System is a full-stack web application that enables healthcare professionals and patients to securely manage personal health records. The system is built with a Node.js and Express backend, a React.js frontend, and a MongoDB Atlas database, deployed on AWS EC2.
The core purpose of the system is to provide a centralised digital platform where doctors can create and manage patient health records, patients can view their own records, and administrators can oversee all system data. The system addresses the common problem of fragmented and inaccessible health information by offering a structured, role-based, and secure web-based solution.
The intended users of the system are:

Doctors who create and manage health records on behalf of their patients
Patients who view their own health records
Administrators who oversee all records and manage the platform

---

## 2. Problem Statement and Scope

### Problem Statement
Traditional paper-based health record systems present significant challenges in modern healthcare settings. Physical records are susceptible to loss or damage, difficult to store over long periods, and inconvenient to access when needed. This system addresses these issues by providing a secure, centralised digital platform where medical records can be accessed anytime and from anywhere, supporting more informed clinical decision-making and improving the overall quality of care.

### In Scope

User registration and login with JWT-based authentication
Role-based access control for Doctor, Patient, and Admin roles
Full CRUD operations on health records (patientName, age, gender, height, weight, bloodType, conditionDetail, diagnosis, medication)
Health record filtering and search by diagnosis, blood type, and gender
A statistics dashboard displaying total record count and distributions by blood type and gender
REST API backend built with Node.js and Express
React.js frontend served via Nginx
Cloud deployment on AWS EC2 with an Application Load Balancer
CI/CD pipeline via GitHub Actions with a self-hosted runner

### Out of Scope

Integration with external healthcare systems
Real-time notifications or messaging between doctors and patients
Payment processing or appointment scheduling
File or image attachments to health records

---

## 3. User Characteristics

The system is designed for three types of users, each with distinct roles and access levels.
Doctors are the primary users of the system. They are responsible for creating, updating, and deleting health records on behalf of their patients. A doctor can only modify or delete records that they themselves created, but can view all records within the system.
Patients are the subjects of the health records stored in the system. They can log in to view only the health records that are associated with their own account. Patients do not have permission to create, modify, or delete any records.
Administrators have the highest level of access within the system. They can view and manage all health records and user accounts across the platform, and are responsible for maintaining data integrity and overseeing overall system operations.

---

## 4. Constraints

The system is subject to several technical constraints. MongoDB Atlas is the only supported database, and no relational database alternatives are used. Authentication is implemented exclusively using JWT; session-based authentication is not supported. The backend is built with Node.js and Express, and the frontend is developed in React.js, served as a static build via Nginx.

---

## 5. Functional Requirements

### User Authentication
FR-01: The system shall allow new users to register by providing their name, phone number, and password. 
FR-02: The system shall allow registered users to log in using their phone number and password and receive a JWT token upon success. FR-03: The system shall reject any API request that does not include a valid JWT token, returning a 401 Unauthorised response. FR-04: The system shall hash all user passwords using bcrypt before storing them in the database. 
FR-05: The system shall allow users to select their role (Doctor or Patient) during registration. Admin accounts shall be created exclusively by an existing Admin and are not available as a registration option.

### Patient Management
FR-06: The system shall allow a Patient to view and update their own profile information. 
FR-07: The system shall allow a Patient to deactivate their own account. 
FR-08: The system shall allow a Patient to view only the medical records associated with their own account.

### Doctor Management
FR-09: The system shall allow a Doctor to view and update their own profile information. 
FR-10: The system shall allow a Doctor to create a new medical record containing patientName, age, gender, height, weight, bloodType, conditionDetail, diagnosis, and medication. 
FR-11: The system shall allow a Doctor to update any medical record in the system. 
FR-12: The system shall allow a Doctor to view all medical records in the system.

### Admin Management
FR-13: The system shall allow an Admin to create new doctor accounts. 
FR-14: The system shall allow an Admin to update the status of any doctor account. 
FR-15: The system shall allow an Admin to view all doctor and patient accounts in the system. 
FR-16: The system shall allow an Admin to delete patient accounts. 
FR-17: The system shall allow an Admin to delete any medical record in the system.

### Record Filtering and Search
FR-18: The system shall allow users to filter medical records by gender (Male, Female, Other). 
FR-19: The system shall allow users to filter medical records by blood type (A+, A-, B+, B-, AB+, AB-, O+, O-). 
FR-20: The system shall allow users to search medical records by diagnosis keyword. 
FR-21: The system shall support combining multiple filter criteria in a single query.

### Statistics Dashboard
FR-22: The system shall provide a dashboard displaying the total number of medical records in the system. 
FR-23: The system shall display the distribution of medical records by blood type. 
FR-24: The system shall display the distribution of medical records by gender.

## 6. Non-Functional Requirement

### Performance
NFR-01: The system shall respond to all standard CRUD API requests within 2 seconds under normal load.
NFR-02: The system shall support multiple concurrent users without significant degradation in response time.

### Security
NFR-03: All API endpoints except /api/auth/register and /api/auth/login shall require a valid JWT token.
NFR-04: Users shall not be able to access, modify, or delete health records that they are not authorised to access based on their role.
NFR-05: All user passwords shall be hashed using bcrypt before being stored in the database.
NFR-06: All sensitive configuration values (MONGO_URI, JWT_SECRET, PORT) shall be stored as environment variables and excluded from version control.

### Reliability
NFR-07: The system shall return appropriate HTTP status codes (200, 201, 400, 401, 404, 500) for all API responses.
NFR-08: All server-side errors shall be caught and returned as structured JSON error messagesNFR-09The system shall maintain high availability through a load-balanced AWS EC2 deployment across two instances.

### Maintainability
NFR-10: The codebase shall follow the MVC architectural pattern to separate concerns across model, controller, and route layers.
NFR-11: The codebase shall be version-controlled using Git with feature branches and pull requests for all changes.
NFR-12: The CI/CD pipeline shall automatically run tests on every push and deploy to EC2 on merge to the main branch.

### Usability
NFR-13: The user interface shall allow a new Doctor to register and create their first health record without assistance.
NFR-14: The statistics dashboard shall present data in a clear visual format that does not require technical knowledge to interpret.

---

## 7. API Specification

Base URL: `/api/records`

| Method | Endpoint | Auth Required | Description | Success Code |
|---|---|---|---|---|
| GET | `/api/records` | Yes | Get all records (admin) or own records (user) | 200 |
| POST | `/api/records` | Yes | Create a new health record | 201 |
| PUT | `/api/records/:id` | Yes | Update a specific health record | 200 |
| DELETE | `/api/records/:id` | Yes | Delete a specific health record | 200 |

### 7.1 Example Request — Create Record
```http
POST /api/records
Authorization: Bearer <token>
Content-Type: application/json

{
  "diagnosis": "Hypertension",
  "notes": "Blood pressure 140/90",
  "date": "2026-04-19"
}
```

### 7.2 Example Response — Success
```json
{
  "_id": "661f0a1e8f1b2c0012345678",
  "userId": "661f0a1e8f1b2c0012345600",
  "diagnosis": "Hypertension",
  "notes": "Blood pressure 140/90",
  "date": "2026-04-19T00:00:00.000Z"
}
```

### 7.3 Example Response — Error (404)
```json
{
  "message": "Record not found"
}
```

---

## 8. Constraints and Assumptions

### 8.1 Constraints
- The system uses MongoDB as the only supported database
- Authentication relies on JWT; session-based auth is out of scope
- The system is designed for small to medium scale usage

### 8.2 Assumptions
- All users must register and log in before accessing health records
- The `req.user` object is populated by authentication middleware before reaching any controller
- Admin role is assigned at the database level (e.g., `isAdmin: true` field on the User model)

---


