import { Router } from 'express';

import removeVeterinarian from '../controllers/veterinarians/removeVeterinarian';
import acceptVeterinarian from '../controllers/veterinarians/acceptVeterinarian';
import getAllVeterinarians from '../controllers/veterinarians/getAllVeterinarians';
import getVeterinarianAnimals from '../controllers/veterinarians/getVeterinarianAnimals';
import getAllEvents from '../controllers/veterinarians/getAllEvents';
import updateEvent from '../controllers/veterinarians/updateEvents';
import getAllEventsProps from '../controllers/veterinarians/getAllEventsProps';
import getNotAcceptedOwners from '../controllers/veterinarians/getAllRequestedUsers';

const router = Router();
router.get('/get', getAllVeterinarians);
router.get('/getAnimals', getVeterinarianAnimals);
router.get('/getEvents', getAllEvents);
router.get('/getEventsProps', getAllEventsProps);
router.get('/getNotAcceptedOwners', getNotAcceptedOwners);

router.post('/updateEvent', updateEvent);
router.post('/accept', acceptVeterinarian);
router.post('/remove', removeVeterinarian);

export default router;
  