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
  console.log(req.files);

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
    newEvent = await events.create({
      report: validatedData.report,
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
    console.log(req.files)
    filesDocuments.forEach(async (element : any) => {
      const response = files.create({
        name: element.fieldname,
        file: element.location,
        label: element.fieldname,
        function: '123',
        eventIdEvent: newEvent.idEvents,
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
