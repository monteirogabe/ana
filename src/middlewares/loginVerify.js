const knex = require("../database/conexão");

const jwt = require("jsonwebtoken");

async function loginVerify(req, res, next) {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ mensagem: "Não autorizado" });
    }

    const token = authorization.split(" ")[1];

    try {
        const { id } = jwt.verify(token, process.env.JWT_PASS);

        const [usuario] = await knex("users").select("*").where({ id: id });

        if (!usuario) {
            return res.status(401).json({ mensagem: "Não autorizado" });
        }

        const { senha, ...dadosUsuario } = usuario;

        req.usuario = dadosUsuario;

        next();
    } catch (error) {
        return res
            .status(401)
            .json({ mensagem: "Erro interno do servidor" + " " + error.message });
    }
}

module.exports = loginVerify;
