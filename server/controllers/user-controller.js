const PostgresDBManager = require('../db/impl/PostgresDBManager');
const { User } = require('../db/models/index');
const bcrypt = require('bcryptjs');

class UserController {

    // Dependency Injection
    constructor(databaseManager, user) {
        this.databaseManager = databaseManager;
        this.user = user;
    }

    updateUser = async (req, res) => {
        try {
            if (req.userId != req.params.id)
                return res.status(400).json({
                    errorMessage: "You can only update your own profile!"
                });

            if (!req.body)
                return res.status(400).json({
                    errorMessage: "Please provide a body to update!"
                });
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
            
            const oldUserBeforeUpdate = await this.databaseManager.readOneById(this.user, req.userId);

            if (oldUserBeforeUpdate.userName !== userName) {
                const existingUser1 = await this.databaseManager.readOne(this.user, { userName: userName });
                if (existingUser1)
                    return res.status(400).json({
                        errorMessage: "User with that username already exists!"
                    });
            }
            if (oldUserBeforeUpdate.email !== email) {
                const existingUser2 = await this.databaseManager.readOne(this.user, { email: email });
                if (existingUser2)
                    return res.status(400).json({
                        errorMessage: "User with that email already exists!"
                    });
            }

            const savedUser = await this.databaseManager.readOneById(this.user, req.params.id);
            if (!savedUser)
                return res.status(404).json({
                    errorMessage: "User not found! Provide id of existing user."
                });

            const saltRounds = 10;
            const salt = await bcrypt.genSalt(saltRounds);
            const passwordHash = await bcrypt.hash(password, salt);

            // Passing id leads to update rather than creating
            const updatedUser = await this.databaseManager.save(this.user, { id: req.params.id, profileImage, userName, email, passwordHash });

            // Pass back user for auth in frontend to be updated
            return res.status(200).json({
                success: true,
                user: {
                    profileImage: updatedUser.profileImage,
                    userName: updatedUser.userName,
                    email: updatedUser.email,
                    userId: updatedUser.id
                }
            });
        } catch(err) {
            console.log(err.message);
            return res.status(500).json({
                errorMessage: err.message
            });
        }
    }

}
const postgresDBManager = new PostgresDBManager();
const userController = new UserController(postgresDBManager, User);
module.exports = userController;