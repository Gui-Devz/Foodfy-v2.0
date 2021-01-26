const adminDB = require("../models/adminDB");
const Recipe = require("../models/recipe");
const File = require("../models/file");
const { formatPath, assignFilesToRecipes } = require("../../lib/utils");

module.exports = {
  async index(req, res) {
    let result = await Recipe.showRecipesWithOnlyOneImage(true);
    const recipesNotFormated = result.rows;

    let recipes = formatPath(recipesNotFormated, req);
    console.log(recipes);

    return res.render("user/index", { recipes });
  },

  about(req, res) {
    return res.render("user/recipes/about");
  },

  async list(req, res) {
    const { filter } = req.query;
    let result = "";
    let recipesNotFormated = "";
    if (!filter) {
      result = await Recipe.showRecipesWithOnlyOneImage();
      recipesNotFormated = result.rows;

      const recipes = formatPath(recipesNotFormated, req);

      return res.render("user/recipes/recipes-list", { recipes });
    } else {
      result = await Recipe.filter(filter);
      recipesNotFormated = result.rows;

      const recipes = formatPath(recipesNotFormated, req);

      return res.render("user/recipes/recipes-list", { recipes, filter });
    }
  },

  async show(req, res) {
    const { id } = req.params;

    let result = await Recipe.showRecipe(id);
    const recipe = result.rows[0];

    console.log(recipe);

    result = await File.showRecipeFiles(id);
    const filesPathNotFormated = result.rows;
    const files = formatPath(filesPathNotFormated, req);
    console.log(files);

    return res.render("user/recipes/show", { recipe, files });
  },

  async showAdmin(req, res) {
    const { id } = req.params;

    let result = await Recipe.showRecipe(id);
    const recipe = result.rows[0];

    result = await File.showRecipeFiles(id);
    let recipeFiles = result.rows;

    //Formatting the path of the photos to send to the front-end
    recipeFiles = formatPath(recipeFiles, req);

    console.log(recipeFiles);
    return res.render("admin/recipes/show", { recipe, recipeFiles });
  },

  edit(req, res) {
    const { id } = req.params;
    Recipe.showRecipe(id, function (recipe) {
      adminDB.chefsIdAndNames(function (chefs) {
        return res.render("admin/recipes/edit", { recipe, chefs });
      });
    });
  },

  create(req, res) {
    adminDB.chefsIdAndNames(function (chefs) {
      return res.render("admin/recipes/create", { chefs });
    });
  },
};
