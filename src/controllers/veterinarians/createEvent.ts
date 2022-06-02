import * as VS from '../../schemas/veterinarianSchema';

import { Request, Response } from 'express';

import events from '../../models/Events';

interface CreateEventProps {
  idEvents: number;
}

const createEvent = async (req: Request, res: Response) => {
  let validatedData;

  //Validate data
  try {
    validatedData = await VS.createEvent.validateAsync(
      req.body as CreateEventProps
    );

    if (!validatedData) {
      res.status(400).send({ message: 'Invalid inputs' });
      return;
    }
  } catch (e: any) {
    console.log('Error validating user data on create event controller');
    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e);
  }

  try {
    const response = await events.create({
      report: validatedData.report,
      eventsStatusIdEventsStatus: validatedData.eventsStatusId,
      eventsTypeIdEventsTypes: validatedData.eventsTypesId,
      animalIdAnimal: validatedData.animalId,
    });

    res.status(200).send(response);
  } catch (e: any) {
    console.log('Error creating event on create event controller');
    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e);
  }
};

export default createEvent;
