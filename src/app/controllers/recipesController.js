const Admin = require("../models/admin");
const Recipe = require("../models/recipe");
const File = require("../models/file");
const Chef = require("../models/chef");
const {
  formatPath,
  renderingRecipesWithOnlyOneFile,
} = require("../../lib/utils");

const fs = require("fs");

module.exports = {
  async list(req, res) {
    try {
      const results = await Recipe.find();

      let recipes = formatPath(results, req);

      //Showing only one recipe instead of one recipe per file.
      recipes = renderingRecipesWithOnlyOneFile(recipes);

      return res.render("main/recipes/recipes-list", { recipes });
    } catch (err) {
      console.error(err);
      let results = await Recipe.find();

      let recipes = formatPath(results, req);

      //Showing only one recipe instead of one recipe per file.
      recipes = renderingRecipesWithOnlyOneFile(recipes);

      recipes = recipes.slice(0, 6);

      return res.render("main/home/index", {
        recipes,
        error: "Erro Inesperado!",
      });
    }
  },

  async show(req, res) {
    try {
      const { id } = req.params;

      let results = await Recipe.find({ where: { "recipes.id": id } });
      const recipe = results[0];

      results = await File.showRecipeFiles(id);
      const files = formatPath(results.rows, req);

      //console.log(recipe);
      return res.render("main/recipes/show", {
        recipe,
        files,
      });
    } catch (err) {
      console.error(err);
      let results = await Recipe.find();

      let recipes = formatPath(results, req);

      //Showing only one recipe instead of one recipe per file.
      recipes = renderingRecipesWithOnlyOneFile(recipes);

      recipes = recipes.slice(0, 6);

      return res.render("main/home/index", {
        recipes,
        error: "Erro Inesperado!",
      });
    }
  },

  async edit(req, res) {
    try {
      const { id } = req.params;
      let results = await Recipe.find({ where: { "recipes.id": id } });
      const recipe = results[0];

      results = await File.showRecipeFiles(id);
      //Formatting the path of the photos to send to the front-end
      let recipeFiles = formatPath(results.rows, req);

      results = await Chef.chefsIdAndNames();
      const chefs = results.rows;

      return res.render("admin/recipes/edit", {
        recipe,
        recipeFiles,
        chefs: chefs,
        userIsAdmin: req.user.is_admin,
      });
    } catch (err) {
      console.error(err);
      let results = await Recipe.find({
        where: { user_id: req.session.userID },
      });
      //Showing only one recipe instead of one recipe per file.
      let recipes = renderingRecipesWithOnlyOneFile(results);

      recipes = formatPath(recipes, req);
      return res.render(`admin/home/index`, {
        error: "Erro inesperado!",
        recipes: recipes,
        userIsAdmin: req.user.is_admin,
      });
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
      let results = await Recipe.find({
        where: { user_id: req.session.userID },
      });
      //Showing only one recipe instead of one recipe per file.
      let recipes = renderingRecipesWithOnlyOneFile(results);

      recipes = formatPath(recipes, req);
      return res.render(`admin/home/index`, {
        error: "Erro inesperado!",
        recipes: recipes,
        userIsAdmin: req.user.is_admin,
      });
    }
  },

  // FORM functions

  async filter(req, res) {
    try {
      const { filter } = req.body;

      let results = "";

      if (filter) {
        results = await Recipe.searchFilter({
          where: { "recipes.title": filter },
          or: { "recipes.information": filter },
        });
      } else {
        results = await Recipe.find();
      }

      let recipes = formatPath(results, req);

      //Showing only one recipe instead of one recipe per file.
      recipes = renderingRecipesWithOnlyOneFile(recipes);

      return res.render("main/recipes/recipes-list", { recipes, filter });
    } catch (error) {
      console.error(err);
      let results = await Recipe.find();

      let recipes = formatPath(results, req);

      //Showing only one recipe instead of one recipe per file.
      recipes = renderingRecipesWithOnlyOneFile(recipes);

      recipes = recipes.slice(0, 6);

      return res.render("main/home/index", {
        recipes,
        error: "Erro Inesperado!",
      });
    }
  },

  async post(req, res) {
    try {
      let results = await Recipe.saving(req.recipe, req.user.id);
      const recipeID = results.rows[0].id;

      const imagesPromises = req.files.map((file) => {
        return File.saving(file.filename, file.path);
      });

      results = await Promise.all(imagesPromises);
      const filesID = results.map((file) => file.rows[0].id);

      //INSERT INTO recipe_files
      const populateRecipeFiles = filesID.map((fileID) =>
        Admin.savingRecipeFiles(fileID, recipeID)
      );

      await Promise.all(populateRecipeFiles);

      return res.redirect(`/admin/recipes/${recipeID}`);
    } catch (err) {
      console.error(err);
      let results = await Recipe.find({
        where: { user_id: req.session.userID },
      });
      //Showing only one recipe instead of one recipe per file.
      let recipes = renderingRecipesWithOnlyOneFile(results);

      recipes = formatPath(recipes, req);
      return res.render(`admin/home/index`, {
        error: "Erro inesperado!",
        recipes: recipes,
        userIsAdmin: req.user.is_admin,
      });
    }
  },

  async put(req, res) {
    try {
      let results = await Recipe.update(req.recipe, req.user.id);
      const recipeID = results.rows[0].id;

      //deleting files from DB and server
      if (req.imagesRemoved.length > 0) {
        const promisesFilesPath = req.imagesRemoved.map((fileID) => {
          return File.show(fileID);
        });

        results = await Promise.all(promisesFilesPath);

        const filesPath = results.map((file) => file.rows[0].file_path);

        filesPath.forEach((filePath) => fs.unlinkSync(filePath));

        const promisesRemovedPhotos = req.imagesRemoved.map((fileID) => {
          return File.delete(fileID);
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
      let results = await Recipe.find({
        where: { user_id: req.session.userID },
      });
      //Showing only one recipe instead of one recipe per file.
      let recipes = renderingRecipesWithOnlyOneFile(results);

      recipes = formatPath(recipes, req);
      return res.render(`admin/home/index`, {
        error: "Erro inesperado!",
        recipes: recipes,
        userIsAdmin: req.user.is_admin,
      });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.body;

      let results = await File.showRecipeFiles(id);
      const filesPath = results.rows.map((file) => file.file_path);
      const filesID = results.rows.map((file) => file.file_id);

      //deleting images from server
      filesPath.forEach((filePath) => fs.unlinkSync(filePath));

      //deleting recipe
      await Recipe.delete(id);
      const promisesDeletingFiles = filesID.map((fileID) =>
        File.delete(fileID)
      );

      await Promise.all(promisesDeletingFiles);

      return res.redirect("/admin");
    } catch (err) {
      console.error(err);
      let results = await Recipe.find({
        where: { user_id: req.session.userID },
      });
      //Showing only one recipe instead of one recipe per file.
      let recipes = renderingRecipesWithOnlyOneFile(results);

      recipes = formatPath(recipes, req);
      return res.render(`admin/home/index`, {
        error: "Erro inesperado!",
        recipes: recipes,
        userIsAdmin: req.user.is_admin,
      });
    }
  },
};
