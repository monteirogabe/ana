const joi = require("joi");

const schemaAddCharge = joi.object({
    descricao: joi.string().required().min(3).max(300).messages({
        'any.required': 'O campo descrição é obrigatório.',
        'string.empty': 'O campo descrição é obrigatório.',
        'string.min': 'O campo descrição deve ter no mínimo 3 caracteres.',
        'string.max': 'O campo descrição deve ter no máximo 300 caracteres.'
    }),

    vencimento: joi.string().required().min(10).max(10).messages({
        'any.required': 'O campo vencimento é obrigatório.',
        'string.empty': 'O campo vencimento é obrigatório.',
        'string.min': 'O formato do vencimento é: DD/MM/AAAA.',
        'string.max': 'O formato do vencimento é: DD/MM/AAAA.'
    }),

    valor: joi.number().required().min(3).messages({
        'any.required': 'O campo valor é obrigatório.',
        'number.empty': 'O campo valor é obrigatório.',
        'number.min': 'O campo valor deve ter no mínimo 3 números.',
    }),

    cobranca_paga: joi.boolean().allow().messages({
        'boolean.empty': 'O campo de cobrança é obrigatório.',
    }),

    cobranca_pendente: joi.boolean().allow().messages({
        'boolean.empty': 'O campo de cobrança é obrigatório.',
    }),

    nome_cliente: joi.string().allow(""),

});

module.exports = schemaAddCharge;