const auth = require('../auth/index');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config({
    path: __dirname + "/../../.env"
});
const PostgresDBManager = require('../db/impl/PostgresDBManager');
const { User } = require('../db/models/index');

class AuthController {
    
    // Dependency Injection
    constructor(databaseManager, user) {
        this.databaseManager = databaseManager;
        this.user = user;
    }

    registerUser = async (req, res) => {
        try {
            const { profileImage, userName, email, password, passwordVerify } = req.body;
            if (!profileImage || !userName || !email || !password || !passwordVerify)
                return res.status(400).json({ 
                    errorMessage: "Please enter all required fields." 
                });
            if (password.length < 8)
                return res.status(400).json({
                    errorMessage: "Please enter a password of at least 8 characters."
                });
            if (password !== passwordVerify)
                return res.status(400).json({
                    errorMessage: "Please enter the same password twice."
                });
            const existingUser = await this.databaseManager.readOne(this.user, { email: email });
            if (existingUser)
                return res.status(400).json({
                    success: false,
                    errorMessage: "An account with this email address already exists."
                });

            const saltRounds = 10;
            const salt = await bcrypt.genSalt(saltRounds);
            const passwordHash = await bcrypt.hash(password, salt);

            const savedUser = await this.databaseManager.save(this.user, {profileImage, userName, email, passwordHash});

            const token = auth.signToken(savedUser.id);
            await res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "none"
            }).status(200).json({
                success: true,
                user: {
                    profileImage: savedUser.profileImage,
                    userName: savedUser.userName,
                    email: savedUser.email              
                }
            });
        } catch (err) {
            return res.status(500).json({
                err: err
            });
        }
    }

}

const postgresDBManager = new PostgresDBManager();
const authController = new AuthController(postgresDBManager, User);
module.exports = authController;