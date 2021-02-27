const adminDB = require("../models/adminDB");
const Recipe = require("../models/recipe");
const File = require("../models/file");
const {
  formatPath,
  validationOfRecipeInputs,
  validationOfBlankForms,
  validationOfChefName,
  renderingRecipesWithOnlyOneFile,
} = require("../../lib/utils");
const fs = require("fs");

module.exports = {
  async index(req, res) {
    try {
      let results = await Recipe.showRecipesWithImages();

      let recipes = formatPath(results.rows, req);

      //Showing only one recipe instead of one recipe per file.
      recipes = renderingRecipesWithOnlyOneFile(recipes);

      console.log(recipes);
      return res.render("admin/home/index", {
        recipes,
        userLogged: req.user,
      });
    } catch (err) {
      console.error(err);
    }
  },

  // FORM routes
  async postRecipe(req, res) {
    try {
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

      let results = await adminDB.savingRecipe(createdRecipe);
      const recipeID = results.rows[0].id;

      const imagesPromises = req.files.map((file) => {
        return adminDB.savingFile(file.filename, file.path);
      });

      results = await Promise.all(imagesPromises);
      const filesID = results.map((file) => file.rows[0].id);

      const populateRecipeFiles = filesID.map((fileID) =>
        adminDB.savingRecipeFiles(fileID, recipeID)
      );

      await Promise.all(populateRecipeFiles);

      return res.redirect(`/admin/recipes/${recipeID}`);
    } catch (err) {
      console.error(err);
    }
  },

  async putRecipe(req, res) {
    try {
      if (validationOfBlankForms(req.body))
        return res.send("fill all the fields");

      //making sure the req.body.files_id is read as an array
      let existingFiles = "";
      if (req.body.files_id) {
        existingFiles = [...req.body.files_id];
        // if (typeof req.body.files_id != "object")
        //   existingFiles = [req.body.files_id];
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

      let results = await adminDB.updateRecipe(createdRecipe);
      const recipeID = results.rows[0].id;

      //making sure that the maximum images sent is 5!
      const totalImagesSent = existingFiles.length + req.files.length;
      if (totalImagesSent > 5)
        return res.send("Send maximum of 5 images only!");

      //making an array out of a string in req.body.removed_files
      // and popping its last index because it's a comma.
      let imagesRemoved = removed_files.split(",");
      imagesRemoved.pop();

      //deleting files from DB and server
      if (imagesRemoved.length > 0) {
        const promisesFilesPath = imagesRemoved.map((fileID) => {
          return File.showFile(fileID);
        });

        results = await Promise.all(promisesFilesPath);

        const filesPath = results.map((file) => file.rows[0].file_path);

        filesPath.forEach((filePath) => fs.unlinkSync(filePath));

        const promisesRemovedPhotos = imagesRemoved.map((fileID) => {
          return adminDB.deleteFilesFromRecipeFiles(fileID);
        });

        await Promise.all(promisesRemovedPhotos);
      }

      //saving the new images
      if (req.files.length != 0) {
        const promisesOfSavingFiles = req.files.map((file) => {
          return adminDB.savingFile(file.filename, file.path);
        });

        results = await Promise.all(promisesOfSavingFiles);
        const promisesRecipeFiles = results.map((file) => {
          return adminDB.savingRecipeFiles(file.rows[0].id, recipeID);
        });

        await Promise.all(promisesRecipeFiles);
      }

      return res.redirect(`/admin/recipes/${recipeID}`);
    } catch (err) {
      console.error(err);
    }
  },

  async deleteRecipe(req, res) {
    try {
      const { id } = req.body;

      let results = await File.showRecipeFiles(id);
      const filesPath = results.rows.map((file) => file.file_path);
      const filesID = results.rows.map((file) => file.file_id);

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
    } catch (err) {
      console.error(err);
    }
  },

  async postChef(req, res) {
    try {
      if (validationOfBlankForms(req.body))
        return res.send("fill all the fields");

      if (req.files.length === 0) return res.send("Send at least one image");

      let results = await adminDB.savingFile(
        req.files[0].filename,
        req.files[0].path
      );
      const fileID = results.rows[0].id;

      const chefName = validationOfChefName(req.body.name);
      results = await adminDB.createChef(chefName, fileID);
      const chefID = results.rows[0].id;

      return res.redirect(`/admin/chefs/${chefID}`);
    } catch (err) {
      console.error(err);
    }
  },

  async putChef(req, res) {
    try {
      if (validationOfBlankForms(req.body))
        return res.send("fill all the fields");

      if (req.body.file_id === 0 && req.files.length === 0)
        return res.send("Send at least one image");

      let results = "";

      if (req.files.length != 0) {
        //getting the old file path to delete from server.
        results = await File.showChefAvatar(req.body.id);
        const oldFile = results.rows[0];

        fs.unlinkSync(oldFile.path);

        results = await adminDB.updateFile(
          oldFile.id,
          req.files[0].filename,
          req.files[0].path
        );
      }

      results = await adminDB.updateChef(req.body.id, req.body.name);

      const chefID = results.rows[0].id;

      return res.redirect(`/admin/chefs/${chefID}`);
    } catch (err) {
      console.error(err);
    }
  },

  async deleteChef(req, res) {
    try {
      const { id, file_id, qt_recipes } = req.body;

      console.log(qt_recipes);

      if (qt_recipes === 0) {
        let results = await File.showChefAvatar(id);
        const file_path = results.rows[0].path;

        await adminDB.deleteChef(id);
        await adminDB.deleteFile(file_id);

        fs.unlinkSync(file_path);

        return res.redirect("/admin/chefs");
      } else {
        return res.send("You cannot delete a chef who has recipes!");
      }
    } catch (err) {
      console.error(err);
    }
  },
};
