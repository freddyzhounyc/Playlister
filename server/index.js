const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const db = require('./db/models/index');

dotenv.config({
    path: __dirname + "/../.env"
});
const PORT = process.env.BACKEND_PORT || 4000;

const startServer = async () => {
    // Initialize DB
    await db.initializeDB();

    const app = express();

    // Middleware
    app.use(express.urlencoded({ extended: true }));
    app.use(cors({
        origin: ["http://localhost:5173"],
        credentials: true
    }));
    app.use(express.json());
    app.use(cookieParser());

    // Routes
    const authRouter = require('./routes/auth-router');
    app.use("/auth", authRouter);

    app.listen(PORT, () => console.log("Backend server listening on port " + PORT));
}
startServer();