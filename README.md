# Health Record Management System

This project is developed for **IFN636 Assessment 1.2**, implementing a full-stack health record management system with **CI/CD pipeline**, **GitHub Actions**, and **AWS EC2 deployment**.

---

## Project Overview

This system allows users to:

- Register and log in
- Create, read, update, and delete health records
- Manage user authentication using JWT
- Access the deployed application via AWS EC2

The project includes:

- **Backend:** Node.js + Express + MongoDB
- **Frontend:** React.js
- **CI/CD:** GitHub Actions + Self-hosted Runner
- **Deployment:** AWS EC2 + PM2 + Nginx

---

## Tech Stack

### **Frontend**
- React.js
- Axios
- React Router

### **Backend**
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication

### **DevOps / Deployment**
- GitHub Actions
- Self-hosted Runner
- AWS EC2 (Ubuntu)
- PM2
- Nginx

---

## Local Setup Instructions

### **1. Clone the repository**
```bash
git clone https://github.com/Aria5927/IFN636-Assessment01
cd IFN636-Assessment01


---


##backend setup
    cd backend
    npm install

    create a .env file inside /backend
        MONGO_URI=your_mongo_uri
        JWT_SECRET=your_jwt_secret
        PORT=5000
    run backend
        npm start


##frontend setup
    cd frontend
    npm install
    npm start

    frontend will run on
        http://localhost :3000

##public deployment URL
    http://54.206.86.251


##test account
    Email: doctor@test.com
    Password: 123456


