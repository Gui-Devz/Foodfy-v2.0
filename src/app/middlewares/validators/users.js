const User = require("../../models/user");

async function isLogged(req, res, next) {
  if (!req.session.userID) {
    const errorCreate = "Crie uma conta para ter acesso a essa funcionalidade!";
    return res.render("session/login", { error: errorCreate });
  }

  const user = await User.find({ where: { id: req.session.userID } });

  req.user = user;

  next();
}

async function isAdmin(req, res, next) {
  const userID = req.session.userID;
  if (!userID) {
    const errorCreate = "Crie uma conta para ter acesso a essa funcionalidade!";
    return res.render("session/login", { error: errorCreate });
  }

  const user = await User.find({ where: { id: userID } });

  if (!user.is_admin) {
    const errorCreate = "Apenas o Admin tem acesso a essa funcionalidade!";
    return res.render("admin/home/index", { error: errorCreate });
  }

  req.user = user;

  next();
}

module.exports = {
  isLogged,
  isAdmin,
};
