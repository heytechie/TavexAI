import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import cors from 'cors'
const port = process.env.PORT || 8001;
const app = express();

app.use(express.json());

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}))
app.use("/", authRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connectDB();
});