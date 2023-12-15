const bcrypt = require("bcrypt");
const knex = require("../database/conexão");
const jwt = require("jsonwebtoken");
const { validateCPF } = require("../utils/functionValidateCpf");

async function userRegister(req, res) {
    const { nome, email, senha, cpf, telefone } = req.body;

    try {
        const UsedEmail = await knex("users")
            .where({ email })
            .first();

        if (UsedEmail) {
            return res
                .status(400)
                .json({ mensagem: "O email informado já existe" });
        }

        const encryptedPassword = await bcrypt.hash(senha, 10);

        const user = await knex("users")
            .insert({
                nome,
                email,
                senha: encryptedPassword,
            });

        return res
            .status(200)
            .json({ mensagem: "Cadastro realizado com sucesso!" });
    } catch (error) {
        return res
            .status(500)
            .json({ mensagem: "Erro interno do servidor." + " " + error.message });
    }
}

async function userLogin(req, res) {
    const { email, senha } = req.body;

    try {
        const user = await knex("users")
            .where({ email })
            .first();

        if (!user) {
            return res
                .status(404)
                .json({ mensagem: "O usuário não foi encontrado" });
        }

        const correctPassword = await bcrypt.compare(senha, user.senha);

        if (!correctPassword) {
            return res
                .status(400)
                .json({ mensagem: "Email ou senha inválida" });
        }

        const dataTokenUser = {
            id: user.id,
            email: user.email,
        };

        const token = jwt.sign(dataTokenUser, process.env.JWT_PASS, {
            expiresIn: "8h",
        });

        const { senha: _, ...dataUser } = user;

        return res
            .status(200)
            .json({
                user: dataUser,
                token,
            });
    } catch (error) {
        return res
            .status(500)
            .json({ mensagem: "Erro interno do servidor." + " " + error.message });
    }
}

async function userList(req, res) {
    try {
        const users = await knex("users");

        return res
            .status(200)
            .json(users);
    } catch (error) {
        return res
            .status(500)
            .json({ mensagem: "Erro interno do servidor." + " " + error.message });
    }
}

async function userUpdate(req, res) {
    const { nome, email, senha, cpf, telefone } = req.body;

    const { id } = req.params;

    try {
        const userToUpdate = await knex("users").where({ id }).first();

        if (!userToUpdate) {
            return res
                .status(404)
                .json({ mensagem: "Usuário não encontrado." });

        }

        if (email && email !== userToUpdate.email) {
            const UsedEmail = await knex("users").where({ email }).first();

            if (UsedEmail) {
                return res.status(400).json({
                    mensagem:
                        "O e-mail informado já está cadastrado para outro usuário.",
                });
            }
        }

        if (email !== userToUpdate.email) {
            const UsedEmail = await knex("users").where({ email }).first();

            if (UsedEmail) {
                return res.status(400).json({
                    mensagem:
                        "O e-mail informado já está cadastrado para outro usuário.",
                });
            }

        }

        if (email !== userToUpdate.email) {
            const UsedEmail = await knex("users").where({ email }).first();

            if (UsedEmail) {
                return res.status(400).json({
                    mensagem:
                        "O e-mail informado já está cadastrado para outro usuário.",
                });
            }
        }

        if (cpf) {
            cpfResult = validateCPF(cpf);
        }

        if (cpf) {
            const UsedCPF = await knex("users")
                .where({ cpf })
                .whereNot({ id })
                .first();

            if (UsedCPF) {
                return res.status(400).json({
                    mensagem:
                        "O CPF informado já está cadastrado para outro usuário.",
                });
            }
        }

        if (telefone !== userToUpdate.telefone) {
            const UsedTelefone = await knex("users")
                .where({ telefone })
                .first();

            if (UsedTelefone) {
                return res.status(400).json({
                    mensagem:
                        "O telefone informado já está cadastrado para outro usuário.",
                });
            }
        }

        const updatedUser = {
            nome: nome || userToUpdate.nome,
            email: email || userToUpdate.email,
            senha: senha ? await bcrypt.hash(senha, 10) : userToUpdate.senha,
            cpf: cpf || userToUpdate.cpf,
            telefone: telefone || userToUpdate.telefone,
        };

        const user = await knex("users").update(updatedUser).where({ id });

        if (!user) {
            return res
                .status(400)
                .json({ mensagem: "Não foi possível atualizar o usuário." });
        }

        return res
            .status(200)
            .json({ mensagem: "Usuário atualizado com sucesso." });
    } catch (error) {
        return res
            .status(406)
            .json({ mensagem: "Erro interno do servidor." + " " + error.message });
    }
}

async function userDelete(req, res) {
    const { id } = req.params;

    try {
        const [user] = await knex("users")
            .select("id", "nome", "email", "senha")
            .where({ id });

        if (!user) {
            return res
                .status(404)
                .json({ mensagem: "Usuário não encontrado." });
        }

        await knex("users")
            .where({ id })
            .del();

        return res
            .status(200)
            .json({ mensagem: "Usuário excluído do sistema com sucesso." });
    } catch (error) {
        return res
            .status(500)
            .json({ mensagem: "Erro interno do servidor." + " " + error.message });
    }
}

module.exports = {
    userRegister,
    userLogin,
    userList,
    userUpdate,
    userDelete,
};
