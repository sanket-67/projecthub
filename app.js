import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import userrouter from './routes/userroute.js';
import { mongoCon } from './db/mongocon.js';
import cors from 'cors';
import { projectroute } from './routes/Projectroute.js';

const app = express();

// Updated CORS configuration


app.use(cors({
    origin: ['https://projecthub1.vercel.app', 'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['set-cookie']
}));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

dotenv.config();
mongoCon();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());
app.use('/users', userrouter);
app.use('/project', projectroute);
app.use(express.static('/public'));

export default app;
