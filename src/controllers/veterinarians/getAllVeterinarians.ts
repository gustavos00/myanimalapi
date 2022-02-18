import { Request, Response } from 'express';
import users from '../../models/User';

const getAllVeterinarians = async (req: Request, res: Response) => {
    let response;
  try {
      response = await users.findAll({where: {isVeterinarian: true}});
  } catch (e: any) {
    console.log(
      'Error getting all veterinarians on get all veterinarians controller'
    );
    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e);
  }

  res.status(200).send(response)
};

export default getAllVeterinarians
