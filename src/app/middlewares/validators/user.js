const User = require("../../models/user");

async function isLogged(req, res, next) {
  if (!req.session.userID) {
    const errorCreate = "Crie uma conta para ter acesso a essa funcionalidade!";
    return res.render("session/login", { error: errorCreate });
  }

  next();
}

async function isAdmin(req, res, next) {
  const userID = req.session.userID;
  if (!userID) {
    const errorCreate = "Crie uma conta para ter acesso a essa funcionalidade!";
    return res.render("session/login", { error: errorCreate });
  }

  const user = await User.findUser({ where: { id: userID } });

  if (!user.isAdmin) {
    const errorCreate = "Apenas o Admin tem acesso a essa funcionalidade!";
    return res.render("admin/home/index", { error: errorCreate });
  }

  console.log(user);

  next();
}

module.exports = {
  isLogged,
  isAdmin,
};
