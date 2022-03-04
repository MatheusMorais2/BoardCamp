import joi from "joi";

const gameCreationSchema = joi.object({
    name: joi.string().required(),
    stockTotal: joi.number().integer().positive(),
    pricePerDay: joi.number().integer().positive(),
    image: joi.string().required(),
    categoryId: joi.number().integer().positive()
});

export default gameCreationSchema; 