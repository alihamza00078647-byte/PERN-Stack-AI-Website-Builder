import "dotenv/config";
import express, { type Request, type Response } from 'express';
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import userRouter from "./Router/userRouter.js";

const app = express();

// Allow URLS Cors Options
const corsOption = {
    origin: process.env.TRUSTED_ORIGIN?.split(',') || [],
    credentials: true,
}


// Middleware
app.use(cors(corsOption));
app.use(express.json({limit: "50mb"}));


app.all('/api/auth/*any', toNodeHandler(auth));
app.use('/api/user/', userRouter);


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});