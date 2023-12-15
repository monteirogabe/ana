const joi = require("joi");

const schemaUserUpdate = joi.object({
    nome: joi.string().min(3).max(50).allow("").messages({
        'string.min': 'O campo nome deve ter no mínimo 3 caracteres.',
        'string.max': 'O campo nome deve ter no máximo 50 caracteres.'
    }),

    email: joi.string().email().allow("").messages({
        'string.email': 'O campo email precisa ter um formato válido. Verifique se contém @ ou .com',
    }),

    senha: joi.string().min(3).allow("").messages({
        "string.min": "A senha precisa conter, no mínimo, 3 caracteres.",
    }),

    cpf: joi.string().min(11).max(11).allow("").messages({
        "string.min": "O campo CPF deve ter no mínimo 11 caracteres.",
        "string.max": "O campo CPF deve ter no máximo 11 caracteres.",
    }),

    telefone: joi.string().min(11).max(11).allow("").messages({
        "string.min":
            "O campo telefone deve ter no mínimo 11 caracteres. O DDD seguido pelos 9 dígitos.",
        "string.max":
            "O campo telefone deve ter no máximo 11 caracteres. O DDD seguido pelos 9 dígitos.",
    }),
});

module.exports = schemaUserUpdate;
