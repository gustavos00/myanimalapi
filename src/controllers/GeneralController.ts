import { Request, Response } from 'express';

const pingEndpoint = (req: Request, res: Response) => {
  res.status(200);
  res.json({ pong: true })
}

export default pingEndpoint