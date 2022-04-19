import { Router } from 'express';

import updateVeterinarianStatus from './../controllers/veterinarians/updateVeterinarianStatus';
import removeVeterinarian from './../controllers/veterinarians/removeVeterinarian';
import acceptVeterinarian from '../controllers/veterinarians/acceptVeterinarian';
import getAllVeterinarians from '../controllers/veterinarians/getAllVeterinarians';
import getVeterinarianAnimals from '../controllers/veterinarians/getVeterinarianAnimals';
import getAllEvents from '../controllers/veterinarians/getAllEvents';
import updateEvent from '../controllers/veterinarians/updateEvents';
import getAllEventsProps from '../controllers/veterinarians/getAllEventsProps';
import createEvent from '../controllers/veterinarians/createEvent';
import getAllEventsProps from '../controllers/veterinarians/getAllEventsProps';
import getNotAcceptedOwners from '../controllers/veterinarians/getAllUnacceptedRequestOwners';

const router = Router();
router.get('/get', getAllVeterinarians);
router.get('/getAnimals', getVeterinarianAnimals);
router.get('/getEvents', getAllEvents);
router.get('/getEventsProps', getAllEventsProps);

router.post('/updateEvent', updateEvent);
router.get('/getNotAcceptedOwners', getNotAcceptedOwners);

router.post('/updateVeterinarianStatus', updateVeterinarianStatus);
router.post('/updateEvent', updateEvent);
router.post('/createEvent', createEvent);
router.post('/accept', acceptVeterinarian);
router.post('/remove', removeVeterinarian);

export default router;
