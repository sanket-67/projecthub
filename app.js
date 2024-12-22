import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import userrouter from './routes/userroute.js';
import {mongoCon} from './db/mongocon.js'
import cors from 'cors'
import { projectroute } from './routes/Projectroute.js';
const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
dotenv.config();
mongoCon()
app.use(express.json())
app.use(cookieParser())
app.use('/users',userrouter)
app.use('/project',projectroute)
app.use(express.static('/public'))
export default app