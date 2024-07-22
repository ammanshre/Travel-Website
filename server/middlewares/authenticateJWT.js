// middlewares/authenticateJWT.js
const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const secret = process.env.JWT_SECRET;
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401); 

    jwt.verify(token, secret, (err, user) => {
        console.log(token)
        console.log(err)
        if (err) return res.sendStatus(403); 
        req.user = user; 
        console.log(req.user)
        next();
    });
};

module.exports = authenticateJWT;
