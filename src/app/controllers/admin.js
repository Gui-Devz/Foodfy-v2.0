const adminDB = require("../models/adminDB");
const Recipe = require("../models/recipe");
const {
  formatPath,
  validationOfRecipeInputs,
  validationOfBlankForms,
  validationOfChefName,
} = require("../../lib/utils");

module.exports = {
  async index(req, res) {
    let result = await Recipe.showRecipesWithOnlyOneImage(true);
    const recipesNotFormated = result.rows;

    let recipes = formatPath(recipesNotFormated, req);
    return res.render("admin/index", { recipes });
  },

  // FORM routes
  async postRecipe(req, res) {
    const { ingredients, preparation } = req.body;

    if (validationOfBlankForms(req.body))
      return res.send("Fill all the fields");

    //Validation of quantity of images sent
    if (req.files === 0) return res.send("Please send at least one image");

    const createdRecipe = {
      ...req.body,
      ingredients: validationOfRecipeInputs(ingredients),
      preparation: validationOfRecipeInputs(preparation),
    };

    let result = await adminDB.savingRecipe(createdRecipe);
    const recipeID = result.rows[0].id;

    const imagesPromises = req.files.map((file) => {
      return adminDB.savingFile(file.filename, file.path);
    });

    result = await Promise.all(imagesPromises);
    const filesID = result.map((file) => file.rows[0].id);

    const populateRecipeFiles = filesID.map((fileID) =>
      adminDB.savingRecipeFiles(fileID, recipeID)
    );

    result = await Promise.all(populateRecipeFiles);

    return res.redirect(`/admin/recipes/${recipeID}`);
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
      ingredients: validationOfRecipeInputs(ingredients),
      preparation: validationOfRecipeInputs(preparation),
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

  async postChef(req, res) {
    if (validationOfBlankForms(req.body))
      return res.send("fill all the fields");

    if (req.files === 0) return res.send("Send at least one image");

    let result = await adminDB.savingFile(
      req.files[0].filename,
      req.files[0].path
    );
    const fileID = result.rows[0].id;

    const chefName = validationOfChefName(req.body.name);
    result = await adminDB.createChef(chefName, fileID);
    const chefID = result.rows[0].id;

    return res.redirect(`/admin/chefs/${chefID}`);
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
