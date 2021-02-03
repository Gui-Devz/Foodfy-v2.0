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

  async putRecipe(req, res) {
    if (validationOfBlankForms(req.body))
      return res.send("fill all the fields");

    //making sure the req.body.files_id is read as an array
    let existingFiles = "";
    if (req.body.files_id) {
      existingFiles = [...req.body.files_id];
      if (typeof req.body.files_id != "object")
        existingFiles = [req.body.files_id];
    }

    if (existingFiles.length === 0 && req.files.length === 0)
      return res.send("Send at least one image");

    const { ingredients, preparation, removed_files } = req.body;

    //formatting the ingredients and preparation
    const createdRecipe = {
      ...req.body,
      ingredients: validationOfRecipeInputs(ingredients),
      preparation: validationOfRecipeInputs(preparation),
    };

    let result = await adminDB.updateRecipe(createdRecipe);
    const recipeID = result.rows[0].id;

    //making sure that the maximum images sent is 5!
    const totalImagesSent = existingFiles.length + req.files.length;
    if (totalImagesSent > 5) return res.send("Send maximum of 5 images only!");

    //making an array out of a string in req.body.removed_files
    // and popping its last index because it's a comma.
    let imagesRemoved = removed_files.split(",");
    imagesRemoved.pop();

    //deleting files from DB and server
    if (imagesRemoved.length > 0) {
      const promisesFilesPath = imagesRemoved.map((fileID) => {
        return File.showFile(fileID);
      });

      result = await Promise.all(promisesFilesPath);

      const filesPath = result.map((file) => file.rows[0].file_path);

      filesPath.forEach((filePath) => fs.unlinkSync(filePath));

      const promisesRemovedPhotos = imagesRemoved.map((fileID) => {
        console.log(fileID);
        return adminDB.deleteFilesFromRecipeFiles(fileID);
      });

      await Promise.all(promisesRemovedPhotos);
    }

    //saving the new images
    if (req.files.length != 0) {
      const promisesOfSavingFiles = req.files.map((file) => {
        return adminDB.savingFile(file.filename, file.path);
      });

      result = await Promise.all(promisesOfSavingFiles);
      const promisesRecipeFiles = result.map((file) => {
        return adminDB.savingRecipeFiles(file.rows[0].id, recipeID);
      });

      await Promise.all(promisesRecipeFiles);
    }

    return res.redirect(`/admin/recipes/${recipeID}`);
  },

  async deleteRecipe(req, res) {
    const { id } = req.body;

    let result = await File.showRecipeFiles(id);
    const filesPath = result.rows.map((file) => file.file_path);
    const filesID = result.rows.map((file) => file.file_id);

    console.log(filesID);

    //deleting images from server
    filesPath.forEach((filePath) => fs.unlinkSync(filePath));

    /*
      We need to delete all the Foreign keys, so we're gonna delete all rows
      in 'recipe_files' table with the recipe_id.
      Then we're gonna need to delete all the files from 'files' table and the
      recipe from 'recipes' tables
    */
    await adminDB.deleteRecipeFromRecipeFiles(id);
    await adminDB.deleteRecipe(id);
    const promisesDeletingFiles = filesID.map((fileID) =>
      adminDB.deleteFile(fileID)
    );

    await Promise.all(promisesDeletingFiles);

    return res.redirect("/admin/recipes");
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

    if (req.body.file_id === 0 && req.files.length === 0)
      return res.send("Send at least one image");

    let result = "";

    if (req.files.length != 0) {
      //getting the old file path to delete from server.
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
