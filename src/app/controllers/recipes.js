const adminDB = require("../models/adminDB");
const Recipe = require("../models/recipe");
const File = require("../models/file");
const {
  formatPath,
  filteringRecipesWithOnlyOneFile,
} = require("../../lib/utils");

module.exports = {
  async index(req, res) {
    try {
      let result = await Recipe.showRecipesWithImages();

      let recipes = formatPath(result.rows, req);

      //Showing only one recipe instead of one recipe per file.
      recipes = filteringRecipesWithOnlyOneFile(recipes);

      recipes = recipes.slice(0, 6);

      return res.render("user/index", { recipes });
    } catch (err) {
      console.error(err);
    }
  },

  about(req, res) {
    return res.render("user/recipes/about");
  },

  async list(req, res) {
    try {
      const { filter } = req.query;
      let result = "";

      result = await Recipe.showRecipesWithImages(filter);

      let recipes = formatPath(result.rows, req);

      //Showing only one recipe instead of one recipe per file.
      recipes = filteringRecipesWithOnlyOneFile(recipes);

      return res.render("user/recipes/recipes-list", { recipes, filter });
    } catch (err) {
      console.error(err);
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
      console.error(err);
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

      return res.render("admin/recipes/show", { recipe, files: recipeFiles });
    } catch (err) {
      console.error(err);
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
      console.error(err);
    }
  },
  async create(req, res) {
    try {
      const result = await adminDB.chefsIdAndNames();
      const chefs = result.rows;

      return res.render("admin/recipes/create", { chefs });
    } catch (err) {
      console.error(err);
    }
  },
};
