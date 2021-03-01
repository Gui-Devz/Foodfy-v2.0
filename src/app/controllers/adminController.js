const adminDB = require("../models/adminDB");
const Recipe = require("../models/recipe");
const File = require("../models/file");
const { showChef, showChefs, showChefsRecipes } = require("../models/chef");
const {
  formatPath,
  renderingRecipesWithOnlyOneFile,
} = require("../../lib/utils");

module.exports = {
  async index(req, res) {
    try {
      let results = "";
      let recipes = "";

      if (req.user.is_admin) {
        results = await Recipe.showRecipesWithImages();

        recipes = formatPath(results.rows, req);

        //Showing only one recipe instead of one recipe per file.
        recipes = renderingRecipesWithOnlyOneFile(recipes);
      } else {
        results = await Recipe.showUserRecipes(req.session.userID);

        recipes = formatPath(results.rows, req);

        //Showing only one recipe instead of one recipe per file.
        recipes = renderingRecipesWithOnlyOneFile(recipes);
      }

      return res.render("admin/home/index", {
        recipes,
        userLogged: req.user,
      });
    } catch (err) {
      console.error(err);
    }
  },

  async showRecipe(req, res) {
    try {
      const { id } = req.params;

      let result = await Recipe.showRecipe(id);
      const recipe = result.rows[0];

      result = await File.showRecipeFiles(id);
      //Formatting the path of the photos to send to the front-end
      let recipeFiles = formatPath(result.rows, req);

      return res.render("admin/recipes/show", {
        recipe,
        files: recipeFiles,
        userLogged: req.user,
      });
    } catch (err) {
      console.error(err);
    }
  },

  //CHEFS functions

  async listChef(req, res) {
    try {
      const result = await showChefs();
      const chefsWithAvatarFormated = formatPath(result.rows, req);

      return res.render("admin/chefs/list", {
        chefs: chefsWithAvatarFormated,
        userLogged: req.user,
      });
    } catch (err) {
      console.error(err);
    }
  },

  createChef(req, res) {
    return res.render("admin/chefs/create", { userLogged: req.user });
  },

  async showChef(req, res) {
    try {
      const { id } = req.params;

      let result = await showChef(id);
      const chefWithAvatarPathFormated = formatPath(result.rows, req);

      result = await showChefsRecipes(id);
      let recipes = formatPath(result.rows, req);

      recipes = renderingRecipesWithOnlyOneFile(recipes);

      return res.render("admin/chefs/show", {
        chef: chefWithAvatarPathFormated[0],
        recipes,
        userLogged: req.user,
      });
    } catch (err) {
      console.error(err);
    }
  },

  async editChef(req, res) {
    try {
      const { id } = req.params;

      let result = await showChef(id);
      const chefWithAvatarPathFormated = formatPath(result.rows, req);

      return res.render("admin/chefs/edit", {
        chef: chefWithAvatarPathFormated[0],
        userLogged: req.user,
      });
    } catch (err) {
      console.error(err);
    }
  },

  // USERS functions

  async listUsers(req, res) {
    try {
      const result = await showChefs();
      const chefsWithAvatarFormated = formatPath(result.rows, req);

      return res.render("main/chefs/list", {
        chefs: chefsWithAvatarFormated,
        userLogged: req.user,
      });
    } catch (err) {
      console.error(err);
    }
  },
};
