import { Request, Response } from "express";
import knex from "../database/connection";
import * as Yup from "yup";
import bcrypt from "bcrypt";

require("dotenv-safe").config();
var jwt = require("jsonwebtoken");

class SessionController {
  async create(request: Request, response: Response) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: "Validation fails" });
    }

    const { email, password } = request.body;

    const user = await knex("users").where("email", email).first();

    if (!user) {
      return response.status(401).json({ error: "Usuário não encontrado!" });
    }

    const isPassword_hash = await bcrypt.compare(password, user.password_hash);

    if (!isPassword_hash) {
      return response.status(401).json({ error: "Senha inválida!" });
    }

    const id = user.id; //esse id viria do banco de dados
    var token = jwt.sign({ id }, process.env.SECRET, {
      expiresIn: "300d", // expires in 300d
    });
    return response.json({ auth: true, token: token });
  }

  async delete(request: Request, response: Response) {
    response.json({ auth: false, token: null });
  }
}

export default SessionController;
