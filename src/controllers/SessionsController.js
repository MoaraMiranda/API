const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const { compare } = require("bcryptjs");
const authConfig = require("../configs/auth");
const { sign } = require("jsonwebtoken");

class SessionsController {
  async create(request, response) {
    const { email, password } = request.body;
    const user = await knex("users").where({ email }).first();

    // validação do usuário - Verificar se o usuário existe
    if (!user) {
      throw new AppError("Email and/or password is incorrect", 401);
    }

    // validação da senha - ver se a senha cadastrada bate com a senha passada
    const passwordMatched = await compare(password, user.password);
    if (!passwordMatched) {
      throw new AppError("Email and/or password is incorrect", 401);
    }

    // criando o token
    const { secret, expiresIn } = authConfig.jwt;
    const token = sign({}, secret, {
      subject: String(user.id),
      expiresIn
    });

    return response.json({ user, token });
  }
}

module.exports = SessionsController;
