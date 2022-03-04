import { Router } from 'express';
import { createGame, getGames } from '../controllers/gamesController.js';
import { gameCreationSchemaValidation } from '../middlewares/gameCreationSchemaValidation.js';

const gamesRouter = Router();

gamesRouter.get('/games', getGames);
gamesRouter.post('/games', gameCreationSchemaValidation, createGame);

export default gamesRouter;

