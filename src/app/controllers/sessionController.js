module.exports = {
  loginForm(req, res) {
    return res.render("session/login");
  },

  async login(req, res) {
    const userID = req.user.id;
    req.session.userID = userID;

    console.log("yeah!");
    return res.redirect("/users");
  },
};
