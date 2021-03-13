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
    return res.render("session/reset-password");
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

  async forgot(req, res) {},

  async reset(req, res) {},
};
