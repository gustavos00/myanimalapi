import { Request, Response } from 'express';

import * as VS from '../../schemas/veterinarianSchema';

import events from '../../models/Events';

interface DeleteEventProps {
  id?: string;
}

const deleteEvent = async (req: Request, res: Response) => {
  let validatedData;

  //Validate data
  try {
    validatedData = await VS.deleteEventSchema.validateAsync(
      req.body as DeleteEventProps
    );

    if (!validatedData) {
      res.status(400).send({ message: 'Invalid inputs' });
      return;
    }
  } catch (e) {
    console.log('Error validating data on delete event controller');

    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e as string);
  }

  //Deleting Event
  try {
    await events.destroy({
      where: { idEvents: validatedData.id },
    });
  } catch (e) {
    console.log('Error deleting data on delete event controller');

    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e as string);
  }

  res.status(200).send({ message: 'Event deleted' });
};

export default deleteEvent