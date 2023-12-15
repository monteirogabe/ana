const knex = require("../database/conexão");
const moment = require("moment");
const { v4: uuidv4 } = require("uuid");

async function registerCharge(req, res) {
  const {
    nome_cliente,
    descricao,
    status,
    valor,
    vencimento,
    cobranca_paga,
    cobranca_pendente,
  } = req.body;

  const { id: cliente_id } = req.params;

  try {
    const dateToday = moment();
    const formattedVencimento = moment(vencimento, "DD/MM/YYYY").toDate();
    const cobrancaId = uuidv4();

    const client = await knex("clients").where({ cliente_id }).first();

    if (!client) {
      return res.status(400).json({ mensagem: "Cliente não encontrado" });
    }

    let status = "";

    if (cobranca_paga) {
      status = "Pago";
    } else if (cobranca_pendente && formattedVencimento < dateToday) {
      status = "Vencida";
    } else if (cobranca_pendente && formattedVencimento >= dateToday) {
      status = "Pendente";
    } else {
      status = "Indefinido";
    }

    const clientName = await knex("clients")
      .select("nome")
      .where({ cliente_id })
      .first();

    if (!clientName) {
      return res.status(400).json({
        mensagem: "Nome do cliente não encontrado ao registrar a cobrança.",
      });
    }

    const charge = await knex("charges")
      .insert({
        criado_por: req.usuario.id,
        cobranca_id: cobrancaId,
        cliente_id,
        nome_cliente: clientName.nome,
        descricao,
        status,
        vencimento: formattedVencimento,
        valor,
        cobranca_paga,
        cobranca_pendente
      })
      .returning("*");

    charge[0].vencimento = moment(charge[0].vencimento).format("DD/MM/YYYY");
    charge[0].nome_cliente = clientName.nome;

    return res.status(200).json({
      mensagem: `Registro de cobrança do cliente: ${clientName.nome}, realizada com sucesso.`,
      charge: charge[0],
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
}

async function listCharges(req, res) {
  try {
    const dateToday = moment();

    const charges = await knex("charges");

    for (let charge of charges) {
      if (charge.cobranca_paga) {
        charge.status = "Pago";
      } else if (charge.cobranca_paga) {
        charge.status =
          charge.vencimento >= dateToday ? "Pendente" : "Pendente";
      } else if (charge.cobranca_pendente) {
        charge.status = charge.vencimento < dateToday ? "Vencida" : "Pendente";
      } else {
        charge.status = charge.vencimento < dateToday ? "Vencida" : "Pendente";
      }
    }

    const updatedCharges = await knex("charges")
      .select(
        "cliente_id",
        "cobranca_id",
        "criado_por",
        "editado_por",
        "nome_cliente",
        "descricao",
        "vencimento",
        "valor"
      )
      .orderBy("cliente_id");

    const formattedCharges = updatedCharges.map((charge) => ({
      ...charge,
      vencimento: moment(charge.vencimento).format("DD/MM/YYYY"),
      status: charge.cobranca_paga
        ? "Pago"
        : charge.cobranca_pendente
          ? charge.vencimento < dateToday
            ? "Vencida"
            : "Pendente"
          : charge.vencimento < dateToday
            ? "Vencida"
            : "Pendente",
    }));

    return res.status(200).json(formattedCharges);
  } catch (error) {
    return res.status(500).json(error.message);
  }
}

async function getChargesByClientId(req, res) {
  const { id } = req.params;

  try {
    const existingClient = await knex("clients")
      .where({ cliente_id: id })
      .first();

    if (!existingClient) {
      return res.status(404).json({ mensagem: "Cliente não encontrado." });
    }

    const charges = await knex("charges")
      .select("nome_cliente", "cobranca_id", "descricao", "vencimento", "valor")
      .where({ cliente_id: id });

    if (!charges || charges.length === 0) {
      return res.status(404).json({
        mensagem: "Não foi encontrada nenhuma cobrança para esse cliente.",
      });
    }

    const formattedCharges = charges.map((charge) => ({
      nome_cliente: charge.nome_cliente,
      cobranca_id: charge.cobranca_id,
      descricao: charge.descricao,
      vencimento: moment(charge.vencimento).format("YYYY-MM-DD"),
      status: charge.cobranca_paga
        ? "Pago"
        : charge.cobranca_pendente
          ? moment(charge.vencimento) < moment()
            ? "Vencida"
            : "Pendente"
          : moment(charge.vencimento) < moment()
            ? "Vencida"
            : "Pendente",
    }));

    return res.status(200).json(formattedCharges);
  } catch (error) {
    return res
      .status(500)
      .json({ mensagem: "Erro interno do servidor:" + " " + error.message });
  }
}

async function getClientAndChargesById(req, res) {
  const { id } = req.params;

  try {
    const dateToday = moment();

    const client = await knex("clients")
      .select("*")
      .where({ cliente_id: id })
      .first();

    if (!client) {
      return res.status(404).json({ mensagem: "Cliente não encontrado." });
    }

    const charges = await knex("charges")
      .select(
        "cobranca_id",
        "descricao",
        "vencimento",
        "valor",
        "cobranca_paga",
        "cobranca_pendente"
      )
      .where({ cliente_id: id });

    let formattedCharges;

    if (!charges || charges.length === 0) {
      formattedCharges = [
        { mensagem: "Não foi encontrada nenhuma cobrança para esse cliente." },
      ];
    } else {
      formattedCharges = charges.map((charge) => ({
        cobranca_id: charge.cobranca_id,
        descricao: charge.descricao,
        vencimento: moment(charge.vencimento).format("YYYY-MM-DD"),
        valor: charge.valor,
        status: charge.cobranca_paga
          ? "Pago"
          : charge.cobranca_pendente
            ? charge.vencimento < dateToday
              ? "Vencida"
              : "Pendente"
            : charge.vencimento < dateToday
              ? "Vencida"
              : "Pendente",
      }));
    }

    const clientStatus = charges.some(
      (charge) => !charge.cobranca_paga && charge.vencimento < dateToday
    )
      ? "Inadimplente"
      : "Em dia";

    return res.status(200).json({
      client: { ...client, status: clientStatus },
      charges: formattedCharges,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ mensagem: "Erro interno do servidor." } + " " + error.message);
  }
}

async function editCharges(req, res) {
  const {
    nome_cliente,
    descricao,
    status,
    vencimento,
    valor,
    cobranca_paga,
    cobranca_pendente,
  } = req.body;
  const { id: cobranca_id } = req.params;

  try {
    const targetCharge = await knex("charges").where({ cobranca_id }).first();

    if (!targetCharge) {
      return res.status(404).json({ mensagem: "Essa cobrança não existe." });
    }

    const dateToday = moment();
    const isPending = moment(vencimento, "YYYY/MM/DD").isAfter(dateToday);

    await knex("charges")
      .where({ cobranca_id })
      .update({
        nome_cliente,
        descricao,
        vencimento,
        valor,
        cobranca_paga,
        cobranca_pendente,
        status: isPending ? "Pendente" : "Vencida",
      })
      .returning("*");

    return res
      .status(200)
      .json({ mensagem: "A cobrança foi atualizada com sucesso." });
  } catch (error) {
    return res
      .status(500)
      .json({ mensagem: `Erro interno do servidor: ${error.message}` });
  }
}

async function deleteCharge(req, res) {
  const { id: cobranca_id } = req.params;

  try {
    const [cobranca] = await knex("charges").select("*").where({ cobranca_id });
    const { status } = cobranca;

    if (!cobranca) {
      return res.status(404).json({ mensagem: "Essa cobrança não existe." });
    }

    if (status === "Pago" || status === "Vencida") {
      return res.status(404).json({
        mensagem:
          "A cobrança já foi paga ou está vencida e não poderá ser excluída.",
      });
    }

    await knex("charges").where({ cobranca_id }).del();

    return res
      .status(200)
      .json({ mensagem: "A cobrança foi removida com sucesso." });
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
}

module.exports = {
  registerCharge,
  listCharges,
  getChargesByClientId,
  getClientAndChargesById,
  editCharges,
  deleteCharge,
};
