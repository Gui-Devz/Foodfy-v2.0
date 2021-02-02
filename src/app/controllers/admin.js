const adminDB = require("../models/adminDB");
const Recipe = require("../models/recipe");
const File = require("../models/file");
const {
  formatPath,
  validationOfRecipeInputs,
  validationOfBlankForms,
  validationOfChefName,
} = require("../../lib/utils");
const fs = require("fs");
const file = require("../models/file");

module.exports = {
  async index(req, res) {
    let result = await Recipe.showRecipesWithOnlyOneImage(true);

    let recipes = formatPath(result.rows, req);
    return res.render("admin/index", { recipes });
  },

  // FORM routes
  async postRecipe(req, res) {
    const { ingredients, preparation } = req.body;

    if (validationOfBlankForms(req.body))
      return res.send("Fill all the fields");

    //Validation of quantity of images sent
    if (req.files.length === 0)
      return res.send("Please send at least one image");

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

    if (req.files.length === 0) return res.send("Send at least one image");

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

  async putChef(req, res) {
    if (validationOfBlankForms(req.body))
      return res.send("fill all the fields");

    if (req.files.length === 0) return res.send("Send at least one image");

    let result = "";

    //this block of code guarantees that the old avatar file is deleted
    //in the server root and that the name and path of the chef's avatar
    //is updated
    if (req.files.length != 0) {
      result = await File.showChefAvatar(req.body.id);
      const oldFile = result.rows[0];

      fs.unlinkSync(oldFile.path);

      result = await adminDB.updateFile(
        oldFile.id,
        req.files[0].filename,
        req.files[0].path
      );
    }

    result = await adminDB.updateChef(req.body.id, req.body.name);

    const chefID = result.rows[0].id;

    return res.redirect(`/admin/chefs/${chefID}`);
  },

  async deleteChef(req, res) {
    const { id, file_id, qt_recipes } = req.body;

    console.log(qt_recipes);

    if (qt_recipes === 0) {
      let result = await File.showChefAvatar(id);
      const file_path = result.rows[0].path;

      await adminDB.deleteChef(id);
      await adminDB.deleteFile(file_id);

      fs.unlinkSync(file_path);

      return res.redirect("/admin/chefs");
    } else {
      return res.send("You cannot delete a chef who has recipes!");
    }
  },
};
