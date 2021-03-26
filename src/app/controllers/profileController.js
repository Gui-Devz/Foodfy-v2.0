const { renderingRecipesWithOnlyOneFile } = require("../../lib/utils");
const User = require("../models/user");
const Recipe = require("../models/recipe");

module.exports = {
  async index(req, res) {
    try {
      return res.render("admin/users/profile", {
        userIsAdmin: req.user.is_admin,
        user: req.user,
      });
    } catch (error) {
      console.error(err);
      let results = await Recipe.find({
        where: { user_id: req.session.userID },
      });
      //Showing only one recipe instead of one recipe per file.
      let recipes = renderingRecipesWithOnlyOneFile(results);

      recipes = formatPath(recipes, req);
      return res.render(`admin/home/index`, {
        error: "Erro inesperado!",
        recipes: recipes,
        userIsAdmin: req.user.is_admin,
      });
    }
  },

  async put(req, res) {
    try {
      const { name, email } = req.body;

      const profile = { name: name, email: email };

      await User.updating(req.user.id, profile);

      return res.render("admin/users/profile", {
        success: "Dados atualizados com sucesso!",
        userIsAdmin: req.user.is_admin,
        user: profile,
      });
    } catch (error) {
      console.error(err);
      let results = await Recipe.find({
        where: { user_id: req.session.userID },
      });
      //Showing only one recipe instead of one recipe per file.
      let recipes = renderingRecipesWithOnlyOneFile(results);

      recipes = formatPath(recipes, req);
      return res.render(`admin/home/index`, {
        error: "Erro inesperado!",
        recipes: recipes,
        userIsAdmin: req.user.is_admin,
      });
    }
  },
};
