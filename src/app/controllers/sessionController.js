const User = require("../models/user");
const crypto = require("crypto");
const mailer = require("../../config/mailer");

module.exports = {
  loginForm(req, res) {
    if (!req.session.userID) {
      return res.render("session/login");
    }
  },

  forgotForm(req, res) {
    return res.render("session/forgot-password");
  },

  resetForm(req, res) {
    const { token } = req.query;
    return res.render("session/reset-password", { token: token });
  },

  login(req, res) {
    try {
      const userID = req.user.id;
      req.session.userID = userID;

      if (req.user.is_admin) {
        return res.redirect("/admin/users");
      } else {
        return res.redirect("/admin/profile");
      }
    } catch (error) {
      console.error(error);
    }
  },

  async logout(req, res) {
    try {
      req.session.destroy();

      console.log("yeah!");
      return res.redirect("/");
    } catch (error) {
      console.error(error);
    }
  },

  async forgot(req, res) {
    try {
      const token = crypto.randomBytes(20).toString("hex");

      const now = new Date();
      const expireHour = now.setHours(now.getHours() + 1);

      await User.updating(req.user.id, {
        reset_token: token,
        reset_token_expires: expireHour,
      });

      const mailMessage = {
        from: "no-reply@foodfy.com.br",
        to: `${req.user.email}`,
        subject: "Recuperar Senha!",
        html: `
            <h1 style="text-align=center">
              Recuperação de senha.
            </h1>
            <p>
              Para recuperar a sua senha clique
              <a href="http://localhost:3000/users/reset-password?token=${token}">aqui</a>.
              <br>
              <h2>
                Esse link tem validade de 1 hora.
              </h2>
            </p>
            `,
      };
      await mailer.sendMail(mailMessage);

      return res.render("main/home/index", {
        success: "Recuperação de senha enviada para o seu email!",
      });
    } catch (error) {
      console.error(error);
    }
  },

  async reset(req, res) {
    const { password } = req.body;

    const id = await User.updating(req.user.id, {
      password: password,
      reset_token: "",
      reset_token_expires: "",
    });
    console.log(id);

    return res.render("session/login", {
      success: "Senha alterada com sucesso!",
    });
  },
};
