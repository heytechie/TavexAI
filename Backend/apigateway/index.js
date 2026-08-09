import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import proxy from 'express-http-proxy';
import cors from 'cors'
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))
app.use(cookieParser())
app.use("/auth", proxy(process.env.AUTH_SERVICE));
const port = process.env.PORT || 8000;


app.listen(process.env.PORT, () => {
    console.log("gateway is running on", process.env.PORT)
})