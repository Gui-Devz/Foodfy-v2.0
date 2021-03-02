const Admin = require("../models/admin");
const Recipe = require("../models/recipe");
const File = require("../models/file");
const Chef = require("../models/chef");
const {
  formatPath,
  renderingRecipesWithOnlyOneFile,
  validationOfBlankFields,
  validationOfRecipeInputs,
} = require("../../lib/utils");

module.exports = {
  async list(req, res) {
    try {
      const { filter } = req.query;
      let result = "";

      result = await Recipe.showRecipesWithImages(filter);

      let recipes = formatPath(result.rows, req);

      //Showing only one recipe instead of one recipe per file.
      recipes = renderingRecipesWithOnlyOneFile(recipes);

      return res.render("main/recipes/recipes-list", { recipes, filter });
    } catch (err) {
      console.error(err);
    }
  },

  async show(req, res) {
    try {
      const { id } = req.params;

      let result = await Recipe.showRecipe(id);
      const recipe = result.rows[0];

      result = await File.showRecipeFiles(id);
      const files = formatPath(result.rows, req);

      return res.render("main/recipes/show", {
        recipe,
        files,
      });
    } catch (err) {
      console.error(err);
    }
  },

  async edit(req, res) {
    try {
      const { id } = req.params;
      let result = await Recipe.showRecipe(id);
      const recipe = result.rows[0];

      result = await File.showRecipeFiles(id);
      //Formatting the path of the photos to send to the front-end
      let recipeFiles = formatPath(result.rows, req);

      result = await Chef.chefsIdAndNames();
      const chefs = result.rows;

      return res.render("admin/recipes/edit", {
        recipe,
        recipeFiles,
        chefs,
        userIsAdmin: req.user.is_admin,
      });
    } catch (err) {
      console.error(err);
    }
  },
  async create(req, res) {
    try {
      const result = await Chef.chefsIdAndNames();
      const chefs = result.rows;

      return res.render("admin/recipes/create", {
        chefs,
        userIsAdmin: req.user.is_admin,
      });
    } catch (err) {
      console.error(err);
    }
  },

  // FORM functions

  async post(req, res) {
    try {
      const { ingredients, preparation } = req.body;

      if (validationOfBlankFields(req.body))
        return res.send("Fill all the fields");

      console.log(req.body);
      console.log(req.user);

      //Validation of quantity of images sent
      if (req.files.length === 0)
        return res.send("Please send at least one image");

      const createdRecipe = {
        ...req.body,
        ingredients: validationOfRecipeInputs(ingredients),
        preparation: validationOfRecipeInputs(preparation),
      };

      let results = await Admin.saving(createdRecipe, req.user.id);
      const recipeID = results.rows[0].id;

      const imagesPromises = req.files.map((file) => {
        return File.saving(file.filename, file.path);
      });

      results = await Promise.all(imagesPromises);
      const filesID = results.map((file) => file.rows[0].id);

      const populateRecipeFiles = filesID.map((fileID) =>
        Admin.savingRecipeFiles(fileID, recipeID)
      );

      await Promise.all(populateRecipeFiles);

      return res.redirect(`/admin/recipes/${recipeID}`);
    } catch (err) {
      console.error(err);
    }
  },

  async put(req, res) {
    try {
      if (validationOfBlankFields(req.body))
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

      let results = await Admin.updateRecipe(createdRecipe);
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
          return File.show(fileID);
        });

        results = await Promise.all(promisesFilesPath);

        const filesPath = results.map((file) => file.rows[0].file_path);

        filesPath.forEach((filePath) => fs.unlinkSync(filePath));

        const promisesRemovedPhotos = imagesRemoved.map((fileID) => {
          return Admin.deleteFilesFromRecipeFiles(fileID);
        });

        await Promise.all(promisesRemovedPhotos);
      }

      //saving the new images
      if (req.files.length != 0) {
        const promisesOfSavingFiles = req.files.map((file) => {
          return File.saving(file.filename, file.path);
        });

        results = await Promise.all(promisesOfSavingFiles);
        const promisesRecipeFiles = results.map((file) => {
          return Admin.savingRecipeFiles(file.rows[0].id, recipeID);
        });

        await Promise.all(promisesRecipeFiles);
      }

      return res.redirect(`/admin/recipes/${recipeID}`);
    } catch (err) {
      console.error(err);
    }
  },

  async delete(req, res) {
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
      await Admin.deleteRecipeFromRecipeFiles(id);
      await Admin.deleteRecipe(id);
      const promisesDeletingFiles = filesID.map((fileID) =>
        Admin.deleteFile(fileID)
      );

      await Promise.all(promisesDeletingFiles);

      return res.redirect("/admin/recipes");
    } catch (err) {
      console.error(err);
    }
  },
};
