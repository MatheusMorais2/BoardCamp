import categoryCreationSchema from '../schemas/categoryCreationSchema.js';

export function categoryCreationSchemaValidation(req, res, next) {

    const validation = categoryCreationSchema.validate(req.body);
    if (validation.error) {
        res.sendStatus(400);
        return;
    }

    next();
}