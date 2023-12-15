const joi = require('joi')

const schemaUserRegister = joi.object({
    nome: joi.string().required().min(3).max(50).messages({
        'any.required': 'O campo nome é obrigatório.',
        'string.empty': 'O campo nome é obrigatório.',
        'string.min': 'O campo nome deve ter no mínimo 3 caracteres.',
        'string.max': 'O campo nome deve ter no máximo 20 caracteres.'
    }),

    email: joi.string().email().required().messages({
        'string.email': 'O campo email precisa ter um formato válido. Verifique se contém @ ou .com',
        'any.required': 'O campo email é obrigatório.',
        'string.empty': 'O campo email é obrigatório.',
    }),

    senha: joi.string().min(3).required().messages({
        'any.required': 'O campo senha é obrigatório.',
        'string.empty': 'O campo senha é obrigatório.',
        'string.min': 'A senha precisa conter, no mínimo, 3 caracteres.',
    }),
});

module.exports = schemaUserRegister;