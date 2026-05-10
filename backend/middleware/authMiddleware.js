const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Chain of Responsibility Pattern
class Handler {
    setNext(handler) {
        this.nextHandler = handler;
        return handler;
    }

    async handle(req, res, next) {
        if (this.nextHandler) {
            return this.nextHandler.handle(req, res, next);
        }
        next();
    }
}

class TokenHandler extends Handler {
    async handle(req, res, next) {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer')) {
            return res.status(401).json({ message: 'Not authorized, no token' });
        }
        try {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            return super.handle(req, res, next);
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }
}

class StatusHandler extends Handler {
    async handle(req, res, next) {
        if (req.user.status === 'Inactive') {
            return res.status(403).json({ message: 'Account is deactivated' });
        }
        return super.handle(req, res, next);
    }
}

class RoleHandler extends Handler {
    constructor(roles) {
        super();
        this.roles = roles;
    }

    async handle(req, res, next) {
        if (!this.roles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: `Access denied. This route is restricted to: ${this.roles.join(', ')}` 
            });
        }
        return super.handle(req, res, next);
    }
}

// Chain: Token - Status - Role
const protect = (...roles) => {
    return async (req, res, next) => {
        const tokenHandler = new TokenHandler();
        const statusHandler = new StatusHandler();

        if (roles.length > 0) {
            const roleHandler = new RoleHandler(roles);
            tokenHandler.setNext(statusHandler).setNext(roleHandler);
        } else {
            tokenHandler.setNext(statusHandler);
        }

        await tokenHandler.handle(req, res, next);
    };
};

module.exports = { protect };