import gameCreationSchema from '../schemas/gameCreationSchema.js';

export function gameCreationSchemaValidation (req, res, next) {

    const validation = gameCreationSchema.validate(req.body);

    if (validation.error) {
        res.sendStatus(400);
        return;
    }

    next();
}