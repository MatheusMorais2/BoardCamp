import { Router } from 'express';
import { createCustomer, getCustomers, updateCustomer, getCustomersbyId} from '../controllers/customerController.js';
import { customerSchemaValidation } from '../middlewares/customerSchemaValidation.js'

const customerRouter = Router();

customerRouter.post('/customers', customerSchemaValidation, createCustomer);
customerRouter.get('/customers', getCustomers);
customerRouter.get('/customers/:id', getCustomersbyId);
customerRouter.put('/customers/:id', customerSchemaValidation, updateCustomer);

export default customerRouter;