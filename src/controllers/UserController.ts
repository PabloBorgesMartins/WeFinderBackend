import { Request, Response } from "express";
import knex from "../database/connection";
import * as Yup from "yup";
import bcrypt from "bcrypt";
import User from '../models/User'


class UserController {
  async create(request: Request, response: Response) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      last_name: Yup.string(),
      nickname: Yup.string(),
      lanes: Yup.string(),
      champion_pool: Yup.string(),
      elo: Yup.string(),
      genre: Yup.string(),
      password: Yup.string().min(6),
      representative: Yup.boolean(),
      email: Yup.string().email(),
      whatsapp: Yup.string(),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: "Validation fails" });
    }

    const userExists = await await knex("users")
      .where("email", request.body.email)
      .first();

    if (userExists) {
      return response.status(400).json({ error: "User already exists." });
    }

    const {
      name,
      last_name,
      nickname,
      lanes,
      champion_pool,
      elo,
      genre,
      password,
      representative,
      email,
      whatsapp,
    } = request.body;

    const trx = await knex.transaction();

    const password_hash = await bcrypt.hash(password, 8);

    const user = {
      name: name,
      last_name: last_name,
      nickname: nickname,
      lanes: lanes,
      champion_pool: champion_pool,
      elo: elo,
      genre: genre,
      password_hash: password_hash,
      representative: representative,
      email: email,
      whatsapp: whatsapp,
    };

    await trx("users").insert(user);

    await trx.commit();

    return response.json(user);
  }

  async update(request: Request, response: Response) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      last_name: Yup.string(),
      nickname: Yup.string(),
      lanes: Yup.string(),
      champion_pool: Yup.string(),
      elo: Yup.string(),
      genre: Yup.string(),
      representative: Yup.boolean(),
      email: Yup.string().email(),
      whatsapp: Yup.string(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when("oldPassword", (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when("password", (password, field) =>
        password ? field.required().oneOf([Yup.ref("password")]) : field
      ),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: "Validation fails" });
    }

    const { email, oldPassword } = request.body;

    //const user = await User.findByPk(request.userId);
    const user = await knex("users").where("id", request.body.id).first();

    if (email !== user.email) {
      const userExists = await knex("users").where("email", email).first();

      if (userExists) {
        return response.status(400).json({ error: "User already exists." });
      }
    }

    if (oldPassword && !(await User.checkPassword(oldPassword))) {
      return response.status(401).json({ error: "Password does not match" });
    }

    const {
      id,
      name,
      last_name,
      nickname,
      lanes,
      champion_pool,
      elo,
      date_birth,
      cell_phone,
      genre,
      representative,
    } = await user.update(request.body);
    return response.json({
      id,
      name,
      last_name,
      nickname,
      lanes,
      champion_pool,
      elo,
      date_birth,
      cell_phone,
      genre,
      email,
      representative,
    });
  }

  //Busca todos usuários
  async index(request: Request, response: Response) {
    const users = await knex("users").select("id", "name", "last_name", "nickname", "lanes", "champion_pool", "elo");

    return response.json(users);
  }

  // Procura um usuario específico
  async show(request: Request, response: Response) {
    const { id } = request.params;

    const user = await knex("users").where("id", id).first();
    // const user = await knex("users").where("id", id).first().select("id", "name", "last_name", "nickname", "lanes", "champion_pool", "elo");

    if (!user) {
      return response.status(400).json({ message: "Usuário não encontrado." });
    }

    return response.json({ user });
  }
}

export default UserController;
