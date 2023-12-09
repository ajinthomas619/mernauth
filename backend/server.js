import express from 'express';
import Cors from 'cors'
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js'
const port = process.env.PORT || 5000;
import connectDB from './config/db.js';

connectDB();
const app = express();

app.use(Cors())

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(cookieParser())

app.use('/api/users', userRoutes);

app.get('/', (req,res)=> res.send('server is ready'));

app.use(notFound)
app.use(errorHandler)

app.listen(port, ()=> console.log(`server started on ${port}`))