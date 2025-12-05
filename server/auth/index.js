const jwt = require("jsonwebtoken");

class authManager {

    // Middleware function where it checks whether a token is present and verified (logged-in)
    verify = (req, res, next) => {
        try {
            const token = req.cookies.token;
            if (!token)
                return res.status(401).json({
                    user: null,
                    loggedIn: false,
                    errorMessage: "Unauthorized"
                });
            const verified = jwt.verify(token, process.env.JWT_SECRET);
            req.userId = verified.userId;
            next();
        } catch (err) {
            return res.status(401).json({
                user: null,
                loggedIn: false,
                errorMessage: "Unauthorized"
            });
        }
    }
    verifyUser = (req, res) => {
        try {
            const token = req.cookies.token;
            if (!token)
                return null;

            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            return decodedToken.userId;
        } catch (err) {
            return null;
        }
    }
    signToken = (userId) => {
        return jwt.sign({
            userId: userId
        }, process.env.JWT_SECRET);
    }

}

const auth = new authManager();
module.exports = auth;