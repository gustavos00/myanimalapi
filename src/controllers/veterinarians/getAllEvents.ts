import { Request, Response } from 'express';

import * as VS from '../../schemas/veterinarianSchema';
import animal from '../../models/Animal';
import events from '../../models/Events';
import eventsStatus from '../../models/EventsStatus';
import eventsTypes from '../../models/EventsTypes';

interface getAllEvents {
  id?: string;
}

const getAllEvents = async (req: Request, res: Response) => {
  let validatedData;
  try {
    validatedData = await VS.getAllEvents.validateAsync(
      req.query as unknown as getAllEvents
    );

    if (!validatedData) {
      res.status(400).send({ message: 'Invalid inputs' });
      return;
    }
  } catch (e: any) {
    console.log(e);
    console.log(
      'Error validating user data on get all veterinarian events requests controller'
    );
    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e);
  }

  try {
    const response = await events.findAll({
      raw: true,
      nest: true,
      include: [
        { model: eventsStatus },
        { model: eventsTypes },
        {
          model: animal,
          required: true,
          where: {
            userIdVeterinarian: validatedData.id,
          },
        },
      ],
    });
    res.status(200).send(response);
  } catch (e: any) {
    console.log(
      'Error finding all animals on get all veterinarian events requests controller'
    );
    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e);
  }
};

export default getAllEvents;
