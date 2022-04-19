import { Request, Response } from 'express';
import events from '../../models/Events';
import eventsStatus from '../../models/EventsStatus';
import eventsTypes from '../../models/EventsTypes';
import files from '../../models/Files';

import * as AS from '../../schemas/animalSchema';

interface GetMedicalEventsProps {
  id: string;
}

const getMedicalEvents = async (req: Request, res: Response) => {
  let validatedData;
  let response;

  //Validate data
  try {
    validatedData = await AS.getMedicalEvents.validateAsync(
      req.query as unknown as GetMedicalEventsProps
    );

    if (!validatedData) {
      res.status(400).send({ message: 'Invalid inputs' });
      return;
    }
  } catch (e) {
    console.log('Error validating data on get medical events controller');

    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e as string);
  }

  try {
    response = await events.findAll({
      where: { animalIdAnimal: validatedData.id },
      include: [
        {
          model: eventsStatus,
        },
        {
          model: eventsTypes,
        },
        {
          model: files,
        },
      ],
    });
    res.status(200).send(response);
  } catch (e: any) {
    console.log(
      'Error finding all friends request on get medical events controller'
    );
    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e);
  }
};

export default getMedicalEvents;
