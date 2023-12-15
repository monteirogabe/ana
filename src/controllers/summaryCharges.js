const knex = require("../database/conexão");

const sumCharges = async (req, res) => {
    const userId = req.params.userId;
    try {
        const chargesPaid = await knex("charges")
            .sum("charges.valor as total")
            .join("clients", "charges.cliente_id", "=", "clients.cliente_id")
            .where("charges.status", "=", "Pago")
            .andWhere("clients.criado_por", "=", userId);

        const chargesPending = await knex("charges")
            .sum("charges.valor as total")
            .join("clients", "charges.cliente_id", "=", "clients.cliente_id")
            .where("charges.status", "=", "Pendente")
            .andWhere("clients.criado_por", "=", userId);

        const chargesOverdue = await knex("charges")
            .sum("charges.valor as total")
            .join("clients", "charges.cliente_id", "=", "clients.cliente_id")
            .where("charges.status", "=", "Vencida")
            .andWhere("clients.criado_por", "=", userId);

        const summaryCharges = {
            paid: chargesPaid[0].total,
            pending: chargesPending[0].total,
            overdue: chargesOverdue[0].total,
        };

        return res.status(200).json(summaryCharges);
    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
};

const summaryOverdue = async (req, res) => {
    const userId = req.params.userId;
    try {
        const chargesOverdue = await knex("charges")
            .leftJoin("clients", "charges.cliente_id", "clients.cliente_id")
            .select(
                "charges.cobranca_id",
                "charges.valor",
                "clients.nome as cliente"
            )
            .where("charges.status", "Vencida")
            .andWhere("charges.criado_por", "=", userId)
            .orderBy("cobranca_id", "desc")
            .limit("4");

        const numberChargesOverdue = await knex("charges")
            .where("status", "Vencida")
            .andWhere("criado_por", "=", userId)
            .count({ Overdue: "criado_por" });

        const data = {
            chargesOverdue,
            total: numberChargesOverdue[0].Overdue,
        };

        return res.status(200).json(data);
    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
};

const summaryPending = async (req, res) => {
    const userId = req.params.userId;
    try {
        const chargesPending = await knex("charges")
            .leftJoin("clients", "charges.cliente_id", "clients.cliente_id")
            .select(
                "charges.cobranca_id",
                "charges.valor",
                "clients.nome as cliente"
            )
            .where("charges.status", "Pendente")
            .andWhere("charges.criado_por", "=", userId)
            .orderBy("cobranca_id", "desc")
            .limit("4");

        const numberChargesPending = await knex("charges")
            .where("status", "Pendente")
            .andWhere("criado_por", "=", userId)
            .count({ Pending: "criado_por" });

        const data = {
            chargesPending,
            total: numberChargesPending[0].Pending,
        };

        return res.status(200).json(data);
    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
};

const summaryPaid = async (req, res) => {
    const userId = req.params.userId;
    try {
        const chargesPaid = await knex("charges")
            .leftJoin("clients", "charges.cliente_id", "clients.cliente_id")
            .select(
                "charges.cobranca_id",
                "charges.valor",
                "clients.nome as cliente"
            )
            .where("charges.status", "Pago")
            .andWhere("charges.criado_por", "=", userId)
            .orderBy("cobranca_id", "desc")
            .limit("4");

        const numberChargespaid = await knex("charges")
            .where("status", "Pago")
            .andWhere("criado_por", "=", userId)
            .count({ Paid: "criado_por" });

        const data = {
            chargesPaid,
            total: numberChargespaid[0].Paid,
        };

        return res.status(200).json(data);
    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
};

module.exports = {
    sumCharges,
    summaryOverdue,
    summaryPending,
    summaryPaid,
};
