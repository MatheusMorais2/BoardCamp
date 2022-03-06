import rentalCreationSchema from "../schemas/rentalCreationSchema.js";

export default function rentalCreationSchemaValidation(req, res, next) {

    const validation = rentalCreationSchema.validate(req.body);
    if(validation.error) return res.sendStatus(400);
    next();
}