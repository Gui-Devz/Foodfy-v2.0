const User = require("../models/user");

module.exports = {
  async index(req, res) {
    const user = await User.findUser({ where: { id: req.session.userID } });

    return res.render("admin/users/profile", { userLogged: user, user });
  },
};
