import express from 'express';
import mongoose  from 'mongoose';
import cors from "cors"
import dotenv from "dotenv";
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
dotenv.config();

connectDB();


const app=express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT} `);
})