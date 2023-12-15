const knex = require("../database/conexão");

const summaryDefaulter = async (req, res) => {
    const userId = req.params.userId;

    try {
        const clientsDefaulter = await knex("clients")
            .select(
                "clients.cliente_id",
                "clients.nome as cliente",
                "clients.cpf"
            )
            .where("clients.status", "Inadimplente")
            .andWhere("clients.criado_por", "=", userId)
            .orderBy("clients.criado_por", "desc")
            .limit("4");

        const numberClientsDefaulter = await knex("clients")
            .where("status", "Inadimplente")
            .andWhere("criado_por", "=", userId)
            .count({ defaulters: "criado_por" });

        const data = {
            clientsDefaulter,
            total: numberClientsDefaulter[0].defaulters,
        };

        return res.status(200).json(data);
    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
};

const summaryGoodStanding = async (req, res) => {
    const userId = req.params.userId;
    try {
        const clientsGoodStanding = await knex("clients")
            .select(
                "clients.cliente_id",
                "clients.nome as cliente",
                "clients.cpf"
            )
            .where("clients.status", "Em dia")
            .andWhere("clients.criado_por", "=", userId)
            .orderBy("clients.criado_por", "desc")
            .limit("4");

        const numberGoodStanding = await knex("clients")
            .where("status", "Em dia")
            .andWhere("criado_por", "=", userId)
            .count({ goodStanding: "criado_por" });

        const data = {
            clientsGoodStanding,
            total: numberGoodStanding[0].goodStanding,
        };

        return res.status(200).json(data);
    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
};

module.exports = {
    summaryDefaulter,
    summaryGoodStanding,
};
