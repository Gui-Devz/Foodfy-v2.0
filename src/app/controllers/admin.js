const adminDB = require("../models/adminDB");
const Recipe = require("../models/recipe");
const Chef = require("../models/chef");

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

  showRecipe(req, res) {
    const { id } = req.params;

    Recipe.showRecipe(id, function (recipe) {
      return res.render("admin/recipes/recipe", { recipe });
    });
  },

  editRecipe(req, res) {
    const { id } = req.params;
    Recipe.showRecipe(id, function (recipe) {
      adminDB.chefsIdAndNames(function (chefs) {
        return res.render("admin/recipes/edit", { recipe, chefs });
      });
    });
  },

  createRecipe(req, res) {
    adminDB.chefsIdAndNames(function (chefs) {
      return res.render("admin/recipes/create", { chefs });
    });
  },

  // FORM routes
  postRecipe(req, res) {
    const keys = Object.keys(req.body);

    for (const key of keys) {
      if (key == "") {
        return res.send("Fill all the fields!");
      }
    }

    adminDB.savingRecipe(req.body, function (recipeID) {
      return res.redirect(`/admin/recipes/${recipeID}`);
    });
  },

  putRecipe(req, res) {
    const keys = Object.keys(req.body);

    for (const key of keys) {
      if (key == "") {
        return res.send("Fill all the fields!");
      }
    }

    adminDB.updateRecipe(req.body, function (recipeID) {
      return res.redirect(`/admin/recipes/${recipeID}`);
    });
  },

  deleteRecipe(req, res) {
    const { id } = req.body;

    adminDB.deleteRecipe(id, function () {
      res.redirect("/admin/recipes/index");
    });
  },

  editChef(req, res) {
    Chef.showChef(function (chef) {
      return res.render("admin/chefs/edit", { chef });
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
