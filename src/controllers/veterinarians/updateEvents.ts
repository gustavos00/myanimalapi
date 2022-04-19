import * as VS from '../../schemas/veterinarianSchema';

import { Request, Response } from 'express';
import users from '../../models/User';
import events from '../../models/Events';

interface UpdateEventProps {
  idEvents: number;
}

const updateEvent = async (req: Request, res: Response) => {
  let validatedData;

  //Validate data
  try {
    validatedData = await VS.updateEvent.validateAsync(
      req.body as UpdateEventProps
    );

    if (!validatedData) {
      res.status(400).send({ message: 'Invalid inputs' });
      return;
    }
  } catch (e: any) {
    console.log('Error validating user data on update event controller');
    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e);
  }

  try {
    events.update(validatedData, {
      where: { idEvents: validatedData.idEvents },
    });

    res.status(200).send({ data: validatedData });
  } catch (e: any) {
    console.log('Error updating user data on update event controller');
    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e);
  }
};

export default updateEvent;
