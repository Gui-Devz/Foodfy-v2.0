const Recipe = require("../models/recipe");
const adminDB = require("../models/adminDB");

module.exports = {
  index(req, res) {
    Recipe.showRecipes(function (recipes) {
      return res.render("index", { recipes });
    });
  },

  about(req, res) {
    return res.render("recipes/about");
  },

  list(req, res) {
    const { filter } = req.query;

    if (!filter) {
      Recipe.showRecipes(function (recipes) {
        return res.render("recipes/recipes-list", { recipes });
      });
    } else {
      Recipe.filter(filter, function (recipes) {
        return res.render("recipes/recipes-list", { recipes, filter });
      });
    }
  },

  show(req, res) {
    const { id } = req.params;

    Recipe.showRecipe(id, function (recipe) {
      return res.render("admin/recipes/recipe", { recipe });
    });
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
