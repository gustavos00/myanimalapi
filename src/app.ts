import express, {
  Request,
  Response
} from 'express';

import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';

import { sequelize } from './config/pg';
import routes from './routes/index';

const server = express();
server.use(cors());
server.use(express.static(path.join(__dirname, '../public')));
server.use(express.urlencoded({ extended: true }));
server.use('/api', routes);
server.use((req: Request, res: Response) => {
  res.status(404).send({ message: 'Route not found.' });
});

server.use(
  rateLimit({
    windowMs: 600000, // 10 minutos duration in milliseconds
    max: 80,
    message:
      'You are doing so many requests from the same IP, try again in 10 minutos.',
    headers: true,
  })
);

// sequelize.sync({force: true})

dotenv.config();
server.listen(process.env.PORT);

console.log(
  ` 🚀 Server running at http://localhost:${process.env.PORT}/api/ 🚀 `
);
