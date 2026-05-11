// Observer Pattern (log)

const fs = require('fs');
const path = require('path');

class Logger {
    constructor() {
        this.logFile = path.join(__dirname, '../logs/app.log');
        const logsDir = path.join(__dirname, '../logs');
        if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir);
        }
    }

    log(event, data) {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] ${event}: ${JSON.stringify(data)}\n`;
        
        fs.appendFileSync(this.logFile, logEntry);
        console.log(logEntry.trim());
    }
}

const logger = new Logger();
module.exports = logger;