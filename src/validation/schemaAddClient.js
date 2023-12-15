const joi = require("joi");

const schemaAddClient = joi.object({
    nome: joi.string().required().min(3).max(30).messages({
        'any.required': 'O campo nome é obrigatório.',
        'string.empty': 'O campo nome é obrigatório.',
        "string.min": "O campo nome deve ter no mínimo 3 caracteres.",
        "string.max": "O campo nome deve ter no máximo 20 caracteres.",
    }),

    email: joi.string().email().required().messages({
        'any.required': 'O campo email é obrigatório.',
        'string.empty': 'O campo email é obrigatório.',
        "string.email":
            "O campo email precisa ter um formato válido. Verifique se contém @ ou .com",
    }),

    cpf: joi.string().required().min(11).max(11).allow("").messages({
        'any.required': 'O campo cpf é obrigatório.',
        'string.empty': 'O campo cpf é obrigatório.',
        "string.min": "O campo CPF deve ter no mínimo 11 caracteres.",
        "string.max": "O campo CPF deve ter no máximo 11 caracteres.",
    }),

    telefone: joi.string().required().min(11).max(11).allow("").messages({
        'any.required': 'O campo telefone é obrigatório.',
        'string.empty': 'O campo telefone é obrigatório.',
        "string.min":
            "O campo telefone deve ter no mínimo 11 caracteres. O DDD seguido pelos 9 dígitos.",
        "string.max":
            "O campo telefone deve ter no máximo 11 caracteres. O DDD seguido pelos 9 dígitos.",
    }),

    cep: joi.string().allow("").min(8).max(8).messages({
        "string.min": "O campo CEP deve ter no mínimo 8 caracteres.",
        "string.max": "O campo CEP deve ter no máximo 8 caracteres.",
    }),

    complemento: joi.string().allow(""),
    logradouro: joi.string().allow(""),
    complemento: joi.string().allow(""),
    bairro: joi.string().allow(""),
    cidade: joi.string().allow(""),
    estado: joi.string().allow(""),
});

module.exports = schemaAddClient;
