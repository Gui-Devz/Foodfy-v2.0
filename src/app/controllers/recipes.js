const Recipe = require("../models/recipe");
const adminDB = require("../models/adminDB");

module.exports = {
  index(req, res) {
    let { filter } = req.query;

    if (filter) {
      console.log(filter);
      Recipe.filterRecipes(filter, function (recipes) {
        return res.render("recipes/index", { recipes });
      });
    } else {
      Recipe.showRecipes(function (recipes) {
        return res.render("recipes/index", { recipes });
      });
    }
  },

  about(req, res) {
    return res.render("recipes/about");
  },

  list(req, res) {
    let { filter } = req.query;

    if (!filter) {
      Recipe.showRecipes(function (recipes) {
        return res.render("recipes/recipes-list", { recipes });
      });
    } else {
      Recipe.filterRecipes(filter, function (recipes) {
        return res.render("recipes/recipes-list", { recipes, filter });
      });
    }
  },

  show(req, res) {
    const { id } = req.params;

    Recipe.showRecipe(id, function (recipe) {
      return res.render("recipes/edit", { recipe });
    });
  },
};
