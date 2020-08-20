const adminDB = require("../models/adminDB");

module.exports = {
  index(req, res) {
    return res.render("admin/index");
  },

  show(req, res) {
    const { id } = req.params;

    return res.render("admin/recipe", {});
  },

  edit(req, res) {
    const { id } = req.params;

    return res.render("admin/edit", {});
  },

  create(req, res) {
    adminDB.chefsIdAndNames(function (chefs) {
      console.log(chefs[0].name);
      return res.render("admin/create", { chefs });
    });
  },

  // FORM routes
  post(req, res) {
    const keys = Object.keys(req.body);

    for (const key of keys) {
      if (key == "") {
        return res.send("Fill all the fields!");
      }
    }

    adminDB.saving(req.body, function (recipeID) {
      return res.redirect(`/admin/recipes/${recipeID}`);
    });
  },

  put(req, res) {
    const { id, image, ingredients, preparation, information } = req.body;
    const keys = Object.keys(req.body);

    for (const key of keys) {
      if (key == "") {
        return res.send("Fill all the fields!");
      }
    }

    /* data.recipes[foundIndex] = {
      ...recipe,
      ...req.body,
      id: Number(id),
      ingredients: newIngredients,
      preparation: newPreparation,
    }; */
  },

  delete(req, res) {
    const { id } = req.body;
  },
};
