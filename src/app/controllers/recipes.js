const adminDB = require("../models/adminDB");
const Recipe = require("../models/recipe");
const File = require("../models/file");
const { formatPath } = require("../../lib/utils");

module.exports = {
  async index(req, res) {
    let result = await Recipe.showRecipesWithOnlyOneImage(true);

    const recipes = formatPath(result.rows, req);

    return res.render("user/index", { recipes });
  },

  about(req, res) {
    return res.render("user/recipes/about");
  },

  async list(req, res) {
    const { filter } = req.query;
    let result = "";

    if (!filter) {
      result = await Recipe.showRecipesWithOnlyOneImage();

      const recipes = formatPath(result.rows, req);

      return res.render("user/recipes/recipes-list", { recipes });
    } else {
      result = await Recipe.filter(filter);

      const recipes = formatPath(result.rows, req);

      return res.render("user/recipes/recipes-list", { recipes, filter });
    }
  },

  async show(req, res) {
    const { id } = req.params;

    let result = await Recipe.showRecipe(id);
    const recipe = result.rows[0];

    result = await File.showRecipeFiles(id);
    const files = formatPath(result.rows, req);

    return res.render("user/recipes/show", { recipe, files });
  },

  async showAdmin(req, res) {
    const { id } = req.params;

    let result = await Recipe.showRecipe(id);
    const recipe = result.rows[0];

    result = await File.showRecipeFiles(id);
    //Formatting the path of the photos to send to the front-end
    let recipeFiles = formatPath(result.rows, req);

    return res.render("admin/recipes/show", { recipe, recipeFiles });
  },

  async edit(req, res) {
    const { id } = req.params;
    let result = await Recipe.showRecipe(id);
    const recipe = result.rows[0];

    result = await File.showRecipeFiles(id);
    //Formatting the path of the photos to send to the front-end
    let recipeFiles = formatPath(result.rows, req);

    result = await adminDB.chefsIdAndNames();
    const chefs = result.rows;

    return res.render("admin/recipes/edit", { recipe, recipeFiles, chefs });
  },

  async create(req, res) {
    const result = await adminDB.chefsIdAndNames();
    const chefs = result.rows;

    return res.render("admin/recipes/create", { chefs });
  },
};
