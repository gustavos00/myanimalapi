import { Request, Response } from 'express';

const ping = (req: Request, res: Response) => {
  res.status(200);
  res.json({ pong: true })
}

export default ping