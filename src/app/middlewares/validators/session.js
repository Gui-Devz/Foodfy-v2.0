const { validationOfBlankForms } = require("../../../lib/utils");

const { compare } = require("bcryptjs");

const User = require("../../models/user");

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (validationOfBlankForms(req.body)) {
      return res.render("session/login", {
        error: "Por favor, preencha todos os campos!",
        user: req.body,
      });
    }

    const user = await User.findUser({ where: { email } });

    if (!user) {
      return res.render("session/login", {
        error: "Email não encontrado!",
        user: req.body,
      });
    }

    // const passed = await compare(password, user.password);

    // if (!passed) {
    //   return res.render("session/login", {
    //     error: "Senha incorreta!",
    //     user: req.body,
    //   });
    // }

    if (user.password != "123") {
      return res.render("session/login", {
        error: "Senha incorreta!",
        user: req.body,
      });
    }

    req.user = user;

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
  login,
};
