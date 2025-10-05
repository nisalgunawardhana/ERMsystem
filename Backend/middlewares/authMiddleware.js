const jwt = require("jsonwebtoken")

module.exports = async(req, res, next) => {
    try {
        const token = req.headers["authorization"].split(" ")[1];
        const jwtSecret = process.env.JWT_SECRET || 'your-jwt-secret-key-change-in-production';
        jwt.verify(token, jwtSecret, (err, decoded) => {

        if(err) {
            return res.status(401).send({
            message : "Auth failed",
            success : false
            });
        } else {
            req.body.userId = decoded.id;
            next();
        }

        })
    } catch (error) {
        return res.status(401).send({
            message : "Auth failed",
            success : false
        });
    }
};
