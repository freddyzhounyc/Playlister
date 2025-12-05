const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

dotenv.config({
    path: __dirname + "/../.env"
});
const PORT = process.env.BACKEND_PORT || 4000;
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


app.listen(PORT, () => console.log("Backend server listening on port " + PORT));