const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Bearer token

    if (!token) {
        return res.status(403).send({ message: 'No token provided' });
    }

    jwt.verify(token, 'mi_clave_super_secreta', (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: 'Unauthorized' });
        }
        req.user = decoded;
        next();
    });
};

const isAdmin = (req, res, next) => {
    if (req.user.rol !== 'admin') {
        return res.status(403).send({ message: 'Require Admin Role' });
    }
    next();
};

const isClienteOrAdmin = (req, res, next) => {
    if (req.user.rol !== 'cliente' && req.user.rol !== 'admin') {
        return res.status(403).send({ message: 'Require Cliente or Admin Role' });
    }
    next();
};

module.exports = {
    verifyToken,
    isAdmin,
    isClienteOrAdmin
};