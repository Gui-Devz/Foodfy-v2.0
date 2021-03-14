const crypto = require("crypto");
const User = require("../models/user");
const mailer = require("../../config/mailer");

const { removingWhiteSpacesInBeginningAndEnding } = require("../../lib/utils");

module.exports = {
  async list(req, res) {
    try {
      const users = await User.find();

      // console.log(users);

      return res.render("admin/users/list", {
        users: users,
        userIsAdmin: req.user.is_admin,
      });
    } catch (err) {
      console.error(err);
    }
  },

  async edit(req, res) {
    const { id } = req.params;

    const user = await User.find({ where: { id } });

    return res.render("admin/users/edit", {
      userIsAdmin: req.user.is_admin,
      user: user[0],
    });
  },

  async create(req, res) {
    return res.render("admin/users/create", {
      userIsAdmin: req.user.is_admin,
    });
  },
  async post(req, res) {
    try {
      const { name, email, is_admin } = req.body;

      const password = crypto.randomBytes(5).toString("hex");
      const token = crypto.randomBytes(20).toString("hex");

      let now = new Date();
      now = now.setHours(now.getHours() + 1);

      const user = {
        name: removingWhiteSpacesInBeginningAndEnding(name),
        email: removingWhiteSpacesInBeginningAndEnding(email),
        password: password,
        is_admin: is_admin ? true : false,
        reset_token: token,
        reset_token_expires: now,
      };

      await User.saving(user);

      const users = await User.find();

      const mailMessage = {
        from: "no-reply@foodfy.com.br",
        to: `${user.email}`,
        subject: "Conta cadastrada com sucesso!",
        html: `
          <h1 style="text-align=center">
            Sua conta foi registrada com sucesso!
          </h1>
          <p>
            Seu email é ${user.email} e sua senha é ${password}.
            <br>
            Recomendamos que troque a sua senha o quanto antes, faça isso
            <a href="http://localhost:3000/users/reset-password?token=${token}">aqui</a>.
            <br>
            <h2>
              Esse link tem validade de 1 hora.
            </h2>
          </p>
          `,
      };

      await mailer.sendMail(mailMessage);

      return res.render("admin/users/list", {
        users: users,
        userIsAdmin: req.user.is_admin,
        success:
          "Usuário Cadastrado com sucesso! Por favor verifique o seu email.",
      });

      //console.log(user);
    } catch (err) {
      console.error(err);
    }
  },

  async put(req, res) {
    try {
    } catch (err) {
      console.error(err);
    }
  },

  async delete(req, res) {
    try {
    } catch (err) {
      console.error(err);
    }
  },
};
