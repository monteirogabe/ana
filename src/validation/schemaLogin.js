const joi = require('joi')

const schemaLogin = joi.object({
    email: joi.string().email().required().messages({
        'string.email': 'O campo email precisa ter um formato válido. Verifique se contém @ ou .com',
        'any.required': 'O campo email é obrigatório.',
        'string.empty': 'Informe o email.',
    }),

    senha: joi.string().min(3).required().messages({
        'any.required': 'O campo senha é obrigatório.',
        'string.empty': 'Informe a senha.',
        'string.min': 'A senha precisa conter, no mínimo, 3 caracteres.',
    }),
});

module.exports = schemaLogin;