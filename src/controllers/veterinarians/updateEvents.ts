import * as VS from '../../schemas/veterinarianSchema';

import { Request, Response } from 'express';

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
    events.update(
      {
        report: validatedData.report,
        eventsStatusIdEventsStatus: validatedData.eventsStatusId,
        eventsTypeIdEventsTypes: validatedData.eventsTypesId,
        animalIdAnimal: validatedData.animalId
      },
      {
        where: { idEvents: validatedData.idEvents },
      }
    );
  } catch (e: any) {
    console.log('Error updating user data on update event controller');
    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e);
  }

  res.status(200).send({ data: validatedData });
};

export default updateEvent;
