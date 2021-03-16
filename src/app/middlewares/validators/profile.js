const { compare } = require("bcryptjs");
const { validationOfBlankFields } = require("../../../lib/utils");

async function checkInputFieldsProfile(req, res, next) {
  try {
    const { password } = req.body;
    if (validationOfBlankFields(req.body)) {
      return res.render("admin/users/profile", {
        error: "Por favor, preencha todos os campos!",
        user: req.body,
        userIsAdmin: req.user.is_admin,
      });
    }

    const passed = await compare(password, req.user.password);

    if (!passed) {
      return res.render("admin/users/profile", {
        error: "Por favor insira a senha correta para atualizar os dados!",
        user: req.body,
        userIsAdmin: req.user.is_admin,
      });
    }

    next();
  } catch (error) {
    console.error(error);
    const allUsers = await User.find();
    return res.render("admin/users/list", {
      error: "Erro inesperado!",
      users: allUsers,
      userIsAdmin: req.user.is_admin,
    });
  }
}

module.exports = {
  checkInputFieldsProfile,
};
