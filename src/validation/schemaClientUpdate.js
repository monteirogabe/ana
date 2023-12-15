const joi = require("joi");

const schemaClientUpdate = joi.object({
    nome: joi.string().min(3).max(30).allow("").messages({
        "string.min": "O campo nome deve ter no mínimo 3 caracteres.",
        "string.max": "O campo nome deve ter no máximo 20 caracteres.",
    }),

    email: joi.string().email().allow("").messages({
        "string.email":
            "O campo email precisa ter um formato válido. Verifique se contém @ ou .com",
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

    cep: joi.string().min(8).max(8).allow("").messages({
        'string.min': 'O campo cep deve ter no mínimo 8 caracteres.',
        'string.max': 'O campo cep deve ter no máximo 8 caracteres.',
    }),

    complemento: joi.string().allow(""),
    logradouro: joi.string().allow(""),
    complemento: joi.string().allow(""),
    bairro: joi.string().allow(""),
    cidade: joi.string().allow(""),
    estado: joi.string().allow(""),
});

module.exports = schemaClientUpdate;
