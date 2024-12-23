import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import userrouter from './routes/userroute.js';
import { mongoCon } from './db/mongocon.js';
import cors from 'cors';
import { projectroute } from './routes/Projectroute.js';

const app = express();

// Updated CORS configuration
const allowedOrigins = [
  'https://projecthub1.vercel.app', // Add any other allowed origins here
  'http://localhost:3000',          // Your React app running locally on port 3000
  'http://localhost:5173'           // The correct port for your frontend
];

// CORS middleware configuration
app.use(cors({
  origin: allowedOrigins,  // Allow these origins
  credentials: true        // Allow credentials (cookies, authorization headers)
}));

dotenv.config();
mongoCon();

app.use(express.json());
app.use(cookieParser());
app.use('/users', userrouter);
app.use('/project', projectroute);
app.use(express.static('/public'));

export default app;
