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

    getLoggedIn = async (req, res) => {
        try {
            let userId = auth.verifyUser(req);
            if (!userId)
                return res.status(200).json({
                    loggedIn: false,
                    user: null,
                    errorMessage: "?"
                });

            const loggedInUser = await this.databaseManager.readOneById(this.user, userId);
            return res.status(200).json({
                loggedIn: true,
                user: {
                    profileImage: loggedInUser.profileImage,
                    userName: loggedInUser.userName,
                    email: loggedInUser.email
                }
            });
        } catch (err) {
            return res.status(500).json({
                err: err
            });
        }
    }
    loginUser = async (req, res) => {
        try {
            const { email, password } = req.body;
            if (!email || !password)
                return res.status(400).json({
                    errorMessage: "Please enter all required fields." 
                });
            const existingUser = await this.databaseManager.readOne(this.user, { email: email });
            if (!existingUser)
                return res.status(401).json({
                    errorMessage: "Wrong email or password provided."
                });
            const passwordCorrect = await bcrypt.compare(password, existingUser.passwordHash);
            if (!passwordCorrect)
                return res.status(401).json({
                    errorMessage: "Wrong email or password provided."
                });
            
            const token = auth.signToken(existingUser.id);
            res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: true
            }).status(200).json({
                success: true,
                user: {
                    profileImage: existingUser.profileImage,
                    userName: existingUser.userName,
                    email: existingUser.email
                }
            });
        } catch (err) {
            return res.status(500).json({
                err: err
            });
        }
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