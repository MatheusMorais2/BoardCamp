import { Router } from 'express';
import { createCategory, getCategories } from '../controllers/categoriesController.js';
import { categoryCreationSchemaValidation } from '../middlewares/categoryCreationSchemaValidation.js';

const categoriesRouter = Router();

categoriesRouter.post('/categories', categoryCreationSchemaValidation, createCategory);
categoriesRouter.get('/categories', getCategories);

export default categoriesRouter;