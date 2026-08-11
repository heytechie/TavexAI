import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import router from "./graph/router.js";


const port = process.env.PORT || 8001;
const app = express();

app.use(express.json());
app.use("/", router);


app.listen(port, () => {
    console.log(`Agent server is running on port ${port}`);
    connectDB();
});