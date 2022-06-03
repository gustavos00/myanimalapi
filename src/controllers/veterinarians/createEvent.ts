import * as VS from '../../schemas/veterinarianSchema';

import { Request, Response } from 'express';

import events, { EventsInstance } from '../../models/Events';
import files from '../../models/Files';

interface CreateEventProps {
  idEvents: number;
}

interface MulterRequest extends Request {
  files: any;
}

const createEvent = async (req: Request, res: Response) => {
  let validatedData;
  let newEvent: EventsInstance;

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
    console.log(validatedData.date)
    newEvent = await events.create({
      report: validatedData.report,
      date: validatedData.date,
      eventsStatusIdEventsStatus: validatedData.eventsStatusId,
      eventsTypeIdEventsTypes: validatedData.eventsTypesId,
      animalIdAnimal: validatedData.animalId,
    });
  } catch (e: any) {
    console.log('Error creating event on create event controller');
    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e);
  }

  try {
    const filesDocuments = (req as MulterRequest).files;
    filesDocuments.forEach(async (element: any) => {
      files.create({
        name: element.originalname,
        file: element.location,
        label: element.originalname,
        function: '',
        eventIdEvents: newEvent.idEvents,
      });
    });
  } catch (e: any) {
    console.log('Error creating files on create event controller');
    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e);
  }

  res.status(200).send(newEvent);
};

export default createEvent;
