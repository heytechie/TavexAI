import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import proxy from 'express-http-proxy';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import protect from './middleware/auth.middleware.js';
import { getCurrentUser } from './controllers/user.controller.js';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true
}));

app.get('/api/user/me', protect, getCurrentUser);
app.use("/auth", proxy(process.env.AUTH_SERVICE || "http://localhost:8001"));

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log("Gateway is running on port", port);
});