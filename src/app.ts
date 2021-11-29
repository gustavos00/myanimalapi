import express, { Request, Response } from 'express';
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors'

import apiRoutes from './routes/routes';

const server = express();
server.use(cors())
server.use(express.static(path.join(__dirname, '../public')));
server.use(express.urlencoded({extended: true}));
server.use('/api', apiRoutes);
server.use((req: Request, res: Response) => {
    res.status(404);
    res.json({error: 'Route not found.'})
})

server.use(
    rateLimit({
        windowMs: 600000, // 10 minutos duration in milliseconds
        max: 80,
        message: 'You are doing so many requests from the same IP, try again in 10 minutos.',
        headers: true,
      })
)

dotenv.config();
server.listen(process.env.PORT)
console.log('Server running at http://localhost:3000/api/')