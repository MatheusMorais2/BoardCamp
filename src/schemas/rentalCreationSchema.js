import joi from 'joi';

const rentalCreationSchema = joi.object({
    customerId: joi.number().required(),
    gameId: joi.number().required(),
    daysRented: joi.number().required()
});

export default rentalCreationSchema;