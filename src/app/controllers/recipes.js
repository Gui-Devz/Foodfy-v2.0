const adminDB = require("../models/adminDB");
const Recipe = require("../models/recipe");
const File = require("../models/file");
const { formatPath } = require("../../lib/utils");

module.exports = {
  async index(req, res) {
    try {
      let result = await Recipe.showRecipesWithOnlyOneImage(true);

      const recipes = formatPath(result.rows, req);

      return res.render("user/index", { recipes });
    } catch (err) {
      throw new Error(err);
    }
  },

  about(req, res) {
    return res.render("user/recipes/about");
  },

  async list(req, res) {
    try {
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
    } catch (err) {
      throw new Error(err);
    }
  },

  async show(req, res) {
    try {
      const { id } = req.params;

      let result = await Recipe.showRecipe(id);
      const recipe = result.rows[0];

      result = await File.showRecipeFiles(id);
      const files = formatPath(result.rows, req);

      return res.render("user/recipes/show", { recipe, files });
    } catch (err) {
      throw new Error(err);
    }
  },

  async showAdmin(req, res) {
    try {
      const { id } = req.params;

      let result = await Recipe.showRecipe(id);
      const recipe = result.rows[0];

      result = await File.showRecipeFiles(id);
      //Formatting the path of the photos to send to the front-end
      let recipeFiles = formatPath(result.rows, req);

      return res.render("admin/recipes/show", { recipe, recipeFiles });
    } catch (err) {
      throw new Error(err);
    }
  },

  async edit(req, res) {
    try {
      const { id } = req.params;
      let result = await Recipe.showRecipe(id);
      const recipe = result.rows[0];

      result = await File.showRecipeFiles(id);
      //Formatting the path of the photos to send to the front-end
      let recipeFiles = formatPath(result.rows, req);

      result = await adminDB.chefsIdAndNames();
      const chefs = result.rows;

      return res.render("admin/recipes/edit", { recipe, recipeFiles, chefs });
    } catch (err) {
      throw new Error(err);
    }
  },

  async create(req, res) {
    try {
      const result = await adminDB.chefsIdAndNames();
      const chefs = result.rows;

      return res.render("admin/recipes/create", { chefs });
    } catch (err) {
      throw new Error(err);
    }
  },
};
