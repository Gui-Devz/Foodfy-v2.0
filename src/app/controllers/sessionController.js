module.exports = {
  loginForm(req, res) {
    return res.render("session/login");
  },

  login(req, res) {
    try {
      const userID = req.user.id;
      req.session.userID = userID;

      return res.redirect("/admin/profile");
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
};
