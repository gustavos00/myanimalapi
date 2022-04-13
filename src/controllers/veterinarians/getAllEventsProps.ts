import { Request, Response } from 'express';

import eventsStatus from '../../models/EventsStatus';
import eventsTypes from '../../models/EventsTypes';

interface getAllEventsProps {
  id?: string;
}

const getAllEventsProps = async (req: Request, res: Response) => {
  let eventsTypesData;
  let eventsStatusData;

  try {
    eventsTypesData = await eventsTypes.findAll({
      raw: true,
    });
  } catch (e: any) {
    console.log(
      'Error finding all animals on get all veterinarian events props requests controller'
    );
    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e);
  }

  try {
    eventsStatusData = await eventsStatus.findAll({
      raw: true,
    });
  } catch (e: any) {
    console.log(
      'Error finding all animals on get all veterinarian events props requests controller'
    );
    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e);
  }

  res
    .status(200)
    .send({ eventsTypes: eventsTypesData, eventsStatus: eventsStatusData });
};

export default getAllEventsProps;
