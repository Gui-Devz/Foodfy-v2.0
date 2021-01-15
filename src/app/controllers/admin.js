const adminDB = require("../models/adminDB");
const Recipe = require("../models/recipe");
const Chef = require("../models/chef");
const File = require("../models/file");
const {
  validationOfInputs,
  validationOfBlankForms,
} = require("../../lib/utils");
const { values } = require("lodash");

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
  async postRecipe(req, res) {
    const { ingredients, preparation } = req.body;

    if (validationOfBlankForms(req.body))
      return res.send("Fill all the fields");

    //Validation of quantity of photos sent
    if (req.files === 0) {
      return res.send("Please send at least one image");
    }

    const createdRecipe = {
      ...req.body,
      ingredients: validationOfInputs(ingredients),
      preparation: validationOfInputs(preparation),
    };

    let result = await adminDB.savingRecipe(createdRecipe);
    const recipeID = result.rows[0].id;

    const imagesPromises = req.files.map((file) => {
      return File.savingFile(file.filename, file.path);
    });

    result = await Promise.all(imagesPromises);
    const filesID = result.map((file) => file.rows[0].id);

    return;
  },

  putRecipe(req, res) {
    const keys = Object.keys(req.body);
    const { ingredients, preparation } = req.body;

    for (const key of keys) {
      if (key == "") {
        return res.send("Fill all the fields!");
      }
    }

    const createdRecipe = {
      ...req.body,
      ingredients: validationOfInputs(ingredients),
      preparation: validationOfInputs(preparation),
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
