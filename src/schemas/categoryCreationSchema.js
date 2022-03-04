import joi from 'joi';

const categoryCreationSchema = joi.object({
    name: joi.string().required()
});

export default categoryCreationSchema;