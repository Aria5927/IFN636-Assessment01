const mongoose = require("mongoose");

// Singleton Pattern
class Database {
    constructor() {
        if (Database.instance) {
            return Database.instance;
        }
        this.connection = null;
        Database.instance = this;
    }

    async connect() {
        if (this.connection) {
            console.log("Using existing MongoDB connection");
            return this.connection;
        }

        try {
            this.connection = await mongoose.connect(process.env.MONGO_URI);
            console.log("MongoDB connected successfully");
            return this.connection;
        } catch (error) {
            console.error("MongoDB connection error:", error.message);
            process.exit(1);
        }
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}

const db = Database.getInstance();
module.exports = db;