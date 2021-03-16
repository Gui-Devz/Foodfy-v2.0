const { renderingRecipesWithOnlyOneFile } = require("../../lib/utils");
const User = require("../models/user");

module.exports = {
  async index(req, res) {
    return res.render("admin/users/profile", {
      userIsAdmin: req.user.is_admin,
      user: req.user,
    });
  },

  async put(req, res) {
    const { name, email } = req.body;

    const profile = { name: name, email: email };

    await User.updating(req.user.id, profile);

    return res.render("admin/users/profile", {
      success: "Dados atualizados com sucesso!",
      userIsAdmin: req.user.is_admin,
      user: profile,
    });
  },
};
