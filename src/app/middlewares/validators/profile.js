const { compare } = require("bcryptjs");
const {
  validationOfBlankFields,
  emailValidation,
} = require("../../../lib/utils");

async function checkInputFieldsProfile(req, res, next) {
  try {
    const { password } = req.body;
    const validation = validationOfBlankFields(req.body);

    if (validation) {
      return res.render("admin/users/profile", {
        error: "Por favor, preencha todos os campos!",
        input: validation,
        user: req.body,
        userIsAdmin: req.user.is_admin,
      });
    }

    //verifying if the email matches with the Regex conditional
    if (!emailValidation(req.body.email)) {
      return res.render("admin/users/profile", {
        error: "Por favor, coloque um email válido!",
        input: "email",
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
