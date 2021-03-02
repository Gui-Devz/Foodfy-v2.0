const { renderingRecipesWithOnlyOneFile } = require("../../lib/utils");
const User = require("../models/user");

module.exports = {
  async index(req, res) {
    const user = await User.find({ where: { id: req.session.userID } });

    return res.render("admin/users/profile", {
      userIsAdmin: req.user.is_admin,
      user: req.user,
    });
  },

  async put(req, res) {},
};
