const { validationOfBlankFields } = require("../../../lib/utils");

const { compare } = require("bcryptjs");

const User = require("../../models/user");

async function checkFormLogin(req, res, next) {
  try {
    const { email, password } = req.body;

    if (validationOfBlankFields(req.body)) {
      return res.render("session/login", {
        error: "Por favor, preencha todos os campos!",
        user: req.body,
      });
    }

    const user = await User.find({ where: { email } });

    if (!user[0]) {
      return res.render("session/login", {
        error: "Email não encontrado!",
        user: req.body,
      });
    }

    const passed = await compare(password, user[0].password);

    if (!passed) {
      return res.render("session/login", {
        error: "Senha incorreta!",
        user: req.body,
      });
    }

    req.user = user[0];

    next();
  } catch (error) {
    console.error(error);
    return res.render("session/login", {
      error: "Erro inesperado, tente novamente.",
      user: req.body,
    });
  }
}
async function checkFormReset(req, res, next) {
  try {
    const { email, password, repeatPassword, token } = req.body;

    const user = await User.find({ where: { email: email } });

    let now = new Date();
    now = now.setHours(now.getHours());

    if (!user[0]) {
      return res.render("session/reset-password", {
        email: email,
        token: token,
        error: "Email não existe, por favor verifique o email digitado!",
      });
    }

    if (now > user[0].reset_token_expires || token !== user[0].reset_token) {
      return res.render("session/reset-password", {
        email: email,
        token: token,
        error:
          "Token inválido, por favor solicite novamente alteração de senha!",
      });
    }

    if (password !== repeatPassword) {
      return res.render("session/reset-password", {
        email: email,
        token: token,
        error: "As senhas digitadas não são iguais!",
      });
    }

    req.user = user[0];

    next();
  } catch (error) {
    console.error(error);
    return res.render("session/login", {
      error: "Erro inesperado, tente novamente.",
      user: req.body,
    });
  }
}
async function checkFormForgot(req, res, next) {
  try {
    const { email } = req.body;

    const user = await User.find({ where: { email: email } });

    if (!user[0]) {
      return res.render("session/forgot-password", {
        email: email,
        error: "Email não existe, por favor verifique o email digitado!",
      });
    }

    req.user = user[0];
    next();
  } catch (error) {
    console.error(error);
    return res.render("session/login", {
      error: "Erro inesperado, tente novamente.",
      user: req.body,
    });
  }
}

module.exports = {
  checkFormLogin,
  checkFormForgot,
  checkFormReset,
};
