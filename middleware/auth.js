const jwt = require('jsonwebtoken');
const config = require('config');

function auth(req, res, next) {
    const token = req.header('x-auth-token');

    // Check for token
    if (! token) 
        return res.status(401).json({msg: "Authroization Denied (Missing Token)"})
    
    try { // Verify Token
        const decoded = jwt.verify(token, config.get("jwtSecret"));

        // Add user from payload
        req.user = decoded;
        next();
    } catch (e) {
        res.status(400).json({msg: "Authorization Denied (Invalid Token)"})
    }

}

module.exports = auth;
