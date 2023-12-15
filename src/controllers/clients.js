const knex = require("../database/conexão");
const { validateCPF } = require("../utils/functionValidateCpf");
const moment = require("moment");

async function registerClient(req, res) {
    const {
        nome,
        email,
        cpf,
        telefone,
        cep,
        logradouro,
        complemento,
        bairro,
        cidade,
        estado,
    } = req.body;

    try {
        const UsedEmail = await knex("clients").where({ email }).first();
        const UsedCPF = await knex("clients").where({ cpf }).first();
        const UsedTelefone = await knex("clients").where({ telefone }).first();

        if (UsedEmail) {
            return res.status(400).json({
                mensagem: "O email informado já está em uso para outro cliente.",
            });
        }

        if (UsedCPF) {
            return res.status(400).json({
                mensagem: "O CPF informado já está em uso para outro cliente.",
            });
        }

        if (UsedTelefone) {
            return res.status(400).json({
                mensagem:
                    "O telefone informado já está em uso para outro cliente..",
            });
        }

        if (cpf) {
            cpfResult = validateCPF(cpf);
        }

        const [client] = await knex("clients")
            .insert({
                nome,
                email,
                cpf,
                telefone,
                cep,
                logradouro,
                complemento,
                bairro,
                cidade,
                estado,
                criado_por: req.usuario.id,
            })
            .returning("*");

        return res.status(200).json(client);
    } catch (error) {
        return res.status(500).json({
            mensagem: "Erro interno do servidor." + " " + error.message,
        });
    }
}

async function clientsList(req, res) {
    const userId = req.params.userId;
    try {
        const userExists = await knex("users").where("id", userId).first();

        if (!userExists) {
            return res
                .status(404)
                .json({ mensagem: "Usuário não encontrado." });
        }

        const chargesExpired = await knex("charges")
            .where("status", "=", "Vencida")
            .select("cliente_id");

        let clientExpired = [];

        chargesExpired.map((charge) => {
            clientExpired.push(charge.cliente_id);
        });

        const clients = await knex("clients");

        for (let client of clients) {
            if (clientExpired.includes(client.cliente_id)) {
                client.status = await knex("clients")
                    .where("cliente_id", client.cliente_id)
                    .update({ status: "Inadimplente" });
            } else {
                client.status = await knex("clients")
                    .where("cliente_id", client.cliente_id)
                    .update({ status: "Em dia" });
            }
        }

        const clientsUpdated = await knex("clients")
            .where("criado_por", userId)
            .select([
                "cliente_id",
                "nome",
                "email",
                "cpf",
                "telefone",
                "status",
            ])
            .orderBy("cliente_id");

        return res.status(200).json(clientsUpdated);
    } catch (error) {
        return res
            .status(500)
            .json(
                { mensagem: "Erro interno do servidor." + " " + error.message }
            );
    }
}

async function clientUpdate(req, res) {
    const {
        nome,
        email,
        cpf,
        telefone,
        cep,
        logradouro,
        complemento,
        bairro,
        cidade,
        estado,
    } = req.body;

    const { id } = req.params;

    try {
        const updatedClient = {
            nome,
            email,
            cpf,
            telefone,
            cep,
            logradouro,
            complemento,
            bairro,
            cidade,
            estado,
            editado_por: req.usuario.id,
        };

        const existingClient = await knex("clients")
            .where({ cliente_id: id })
            .first();

        if (!existingClient) {
            return res.status(404).json({ mensagem: "Cliente não encontrado." });
        }

        if (cpf) {
            const UsedCPF = await knex("clients")
                .where({ cpf })
                .whereNot({ cliente_id: id })
                .first();

            if (UsedCPF) {
                return res.status(400).json({
                    mensagem:
                        "O CPF informado já está cadastrado para outro cliente.",
                });
            }
        }

        if (cpf) {
            cpfResult = validateCPF(cpf);
        }

        if (email !== existingClient.email) {
            const UsedEmail = await knex("clients").where({ email }).first();

            if (UsedEmail) {
                return res.status(400).json({
                    mensagem:
                        "O e-mail informado já está cadastrado para outro cliente.",
                });
            }
        }

        if (telefone) {
            const UsedTelefone = await knex("clients")
                .where({ telefone })
                .whereNot({ cliente_id: id })
                .first();

            if (UsedTelefone) {
                return res.status(400).json({
                    mensagem:
                        "O telefone informado já está cadastrado para outro cliente.",
                });
            }
        }

        const [client] = await knex("clients")
            .update(updatedClient)
            .where({ cliente_id: id })
            .returning("*");

        if (!client) {
            return res
                .status(400)
                .json({ mensagem: "Não foi possível atualizar o cliente." });
        }

        return res
            .status(200)
            .json({ mensagem: "Cliente atualizado com sucesso." });
    } catch (error) {
        return res.status(406).json({ mensagem: "Erro interno do servidor." + " " + error.message });
    }
}

async function getClientInfoById(req, res) {
    const { id } = req.params;

    try {
        const existingClient = await knex("clients")
            .where({ cliente_id: id })
            .first();

        if (!existingClient) {
            return res.status(404).json({ mensagem: "Cliente não encontrado." });
        }

        const clientInfo = await knex("clients")
            .select(
                "clients.cliente_id",
                "clients.nome",
                "clients.email",
                "clients.cpf",
                "clients.telefone",
                "charges.status as status"
            )
            .leftJoin("charges", "clients.cliente_id", "charges.cliente_id")
            .where("clients.cliente_id", id)
            .first();

        const charges = await knex("charges")
            .select(
                "charges.nome_cliente",
                "charges.cobranca_id",
                "descricao",
                "status",
                "valor",
                "vencimento",
                "status"
            )
            .where({ cliente_id: id });

        const updatedCharges = charges.map((charge) => {
            const isPaga = charge.status === "Pago";
            const isPendente = charge.status === "Pendente";
            const isVencida = moment(charge.vencimento) < moment();

            if (isPaga) {
                return { ...charge, status_da_cobranca: "Pago" };
            } else if (isPendente && !isVencida) {
                return { ...charge, status_da_cobranca: "Pendente" };
            } else {
                return { ...charge, status_da_cobranca: "Vencida" };
            }
        });

        const isInadimplente = updatedCharges
            .map((charge) => charge.status_da_cobranca)
            .includes("Vencida");

        clientInfo.status = isInadimplente ? "Inadimplente" : "Em dia";

        const chargesInfo = charges.map((charge) => ({
            nome_cliente: charge.nome_cliente,
            cobranca_id: charge.cobranca_id,
            descricao: charge.descricao,
            status_da_cobranca: charge.status_da_cobranca,
            valor: charge.valor,
            vencimento: moment(charge.vencimento).format("YYYY-MM-DD"),
            status: charge.status,
        }));

        return res.status(200).json({ clientInfo, chargesInfo });
    } catch (error) {
        return res.status(500).json({
            mensagem: "Erro interno do servidor" + " " + error.message,
        });
    }
}

module.exports = {
    registerClient,
    clientsList,
    clientUpdate,
    getClientInfoById,
};
