import { Router } from 'express';

import { createRental, getRentals, updateRental, deleteRental} from '../controllers/rentalsController.js';
import rentalCreationSchemaValidation from '../middlewares/rentalCreationSchemaValidation.js';

const rentalRouter = Router();

rentalRouter.post('/rentals', rentalCreationSchemaValidation, createRental);
rentalRouter.get('/rentals', getRentals);
rentalRouter.put('/rentals', updateRental);
rentalRouter.delete('/rentals', deleteRental);

export default rentalRouter;