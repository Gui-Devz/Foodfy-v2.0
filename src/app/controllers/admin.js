const adminDB = require("../models/adminDB");
const Recipe = require("../models/recipe");
const Chef = require("../models/chef");
const { validationOfInputs } = require("../../lib/utils");

module.exports = {
  index(req, res) {
    let { filter } = req.query;

    if (filter) {
      console.log(filter);
      Recipe.filterRecipes(filter, function (recipes) {
        return res.render("admin/index", { recipes });
      });
    } else {
      Recipe.showRecipes(function (recipes) {
        return res.render("admin/index", { recipes });
      });
    }
  },

  // FORM routes
  postRecipe(req, res) {
    const keys = Object.keys(req.body);
    const { ingredients, steps } = req.body;

    for (const key of keys) {
      if (key == "") {
        return res.send("Fill all the fields!");
      }
    }

    const createdRecipe = {
      ...req.body,
      ingredients: validationOfInputs(ingredients),
      steps: validationOfInputs(steps),
    };

    adminDB.savingRecipe(createdRecipe, function (recipeID) {
      return res.redirect(`/admin/recipes/${recipeID}`);
    });
  },

  putRecipe(req, res) {
    const keys = Object.keys(req.body);
    const { ingredients, steps } = req.body;

    for (const key of keys) {
      if (key == "") {
        return res.send("Fill all the fields!");
      }
    }

    const createdRecipe = {
      ...req.body,
      ingredients: validationOfInputs(ingredients),
      steps: validationOfInputs(steps),
    };

    adminDB.updateRecipe(createdRecipe, function (recipeID) {
      return res.redirect(`/admin/recipes/${recipeID}`);
    });
  },

  deleteRecipe(req, res) {
    const { id } = req.body;
    console.log(id);

    adminDB.deleteRecipe(id, function () {
      res.redirect("/admin/recipes");
    });
  },

  postChef(req, res) {
    const keys = Object.keys(req.body);

    for (const key of keys) {
      if (key == "") {
        return res.send("Fill all the fields!");
      }
    }

    adminDB.createChef(req.body, function (id) {
      return res.redirect(`/admin/chefs/${id}`);
    });
  },

  putChef(req, res) {
    const keys = Object.keys(req.body);

    for (const key of keys) {
      if (key == "") {
        return res.send("Fill all the fields!");
      }
    }

    adminDB.updateChef(req.body, function (id) {
      return res.redirect(`/admin/chefs/${id}`);
    });
  },

  deleteChef(req, res) {
    const { id } = req.body;

    adminDB.deleteChef(id, function () {
      return res.redirect("/admin/chefs");
    });
  },
};
