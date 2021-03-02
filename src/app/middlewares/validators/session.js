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
async function checkFormReset(req, res, next) {
  try {
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
