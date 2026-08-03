import "dotenv/config";
import express, { type Request, type Response } from 'express';
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";

const app = express();

// Allow URLS Cors Options
const corsOption = {
    origin: process.env.TRUSTED_ORIGIN?.split(',') || [],
    credential: true,
}


// Middleware
app.use(cors(corsOption));
app.use(express.json());

app.all('/api/auth/{*any}', toNodeHandler(auth));



const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
    res.send('Server is Live!');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});