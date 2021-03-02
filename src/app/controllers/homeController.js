const Recipe = require("../models/recipe");

const {
  formatPath,
  renderingRecipesWithOnlyOneFile,
} = require("../../lib/utils");

module.exports = {
  async index(req, res) {
    try {
      let result = await Recipe.showRecipesWithImages();

      let recipes = formatPath(result.rows, req);

      //Showing only one recipe instead of one recipe per file.
      recipes = renderingRecipesWithOnlyOneFile(recipes);

      recipes = recipes.slice(0, 6);

      return res.render("main/home/index", { recipes });
    } catch (err) {
      console.error(err);
    }
  },

  async list(req, res) {
    try {
      const { filter } = req.query;
      let result = "";

      result = await Recipe.showRecipesWithImages(filter);

      let recipes = formatPath(result.rows, req);

      //Showing only one recipe instead of one recipe per file.
      recipes = renderingRecipesWithOnlyOneFile(recipes);

      return res.render("user/recipes/recipes-list", { recipes, filter });
    } catch (err) {
      console.error(err);
    }
  },
};
