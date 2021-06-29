const RecipesFiles = require('../models/RecipesFiles');
const Recipe = require('../models/recipe');
const File = require('../models/file');
const Chef = require('../models/chef');
const {
  formatPath,
  renderingRecipesWithOnlyOneFile,
  arrayDB,
} = require('../../lib/utils');

const fs = require('fs');

module.exports = {
  async list(req, res) {
    try {
      const results = await Recipe.find();

      let recipes = formatPath(results, req);

      //Showing only one recipe instead of one recipe per file.
      recipes = renderingRecipesWithOnlyOneFile(recipes);

      return res.render('main/recipes/recipes-list', { recipes });
    } catch (err) {
      console.error(err);
      let results = await Recipe.find();

      let recipes = formatPath(results, req);

      //Showing only one recipe instead of one recipe per file.
      recipes = renderingRecipesWithOnlyOneFile(recipes);

      recipes = recipes.slice(0, 6);

      return res.render('main/home/index', {
        recipes,
        error: 'Erro Inesperado!',
      });
    }
  },

  async show(req, res) {
    try {
      const { id } = req.params;

      let results = await Recipe.find({ where: { 'recipes.id': id } });
      const recipe = results[0];

      results = await File.showRecipeFiles(id);
      const files = formatPath(results.rows, req);

      //console.log(recipe);
      return res.render('main/recipes/show', {
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

      return res.render('main/home/index', {
        recipes,
        error: 'Erro Inesperado!',
      });
    }
  },

  async edit(req, res) {
    try {
      const { id } = req.params;
      let results = await Recipe.find({ where: { 'recipes.id': id } });
      const recipe = results[0];

      results = await File.showRecipeFiles(id);
      //Formatting the path of the photos to send to the front-end
      let recipeFiles = formatPath(results.rows, req);

      results = await Chef.chefsIdAndNames();
      const chefs = results.rows;

      return res.render('admin/recipes/edit', {
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
        error: 'Erro inesperado!',
        recipes: recipes,
        userIsAdmin: req.user.is_admin,
      });
    }
  },

  async create(req, res) {
    try {
      const result = await Chef.chefsIdAndNames();
      const chefs = result.rows;

      return res.render('admin/recipes/create', {
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
        error: 'Erro inesperado!',
        recipes: recipes,
        userIsAdmin: req.user.is_admin,
      });
    }
  },

  // FORM functions

  async filter(req, res) {
    try {
      const { filter } = req.body;

      let results = '';

      if (filter) {
        results = await Recipe.searchFilter({
          where: { 'recipes.title': filter },
          or: { 'recipes.information': filter },
        });
      } else {
        results = await Recipe.find();
      }

      let recipes = formatPath(results, req);

      //Showing only one recipe instead of one recipe per file.
      recipes = renderingRecipesWithOnlyOneFile(recipes);

      return res.render('main/recipes/recipes-list', { recipes, filter });
    } catch (error) {
      console.error(err);
      let results = await Recipe.find();

      let recipes = formatPath(results, req);

      //Showing only one recipe instead of one recipe per file.
      recipes = renderingRecipesWithOnlyOneFile(recipes);

      recipes = recipes.slice(0, 6);

      return res.render('main/home/index', {
        recipes,
        error: 'Erro Inesperado!',
      });
    }
  },

  async post(req, res) {
    try {
      //I have to add in this object the user_id,
      //but in the right position to have success in
      //the exec of the query create()
      const recipeObject = {
        chef_id: req.recipe.chef_id,
        user_id: req.user.id,
        title: req.recipe.title,
        ingredients: arrayDB(req.recipe.ingredients),
        preparation: arrayDB(req.recipe.preparation),
        information: req.recipe.information,
      };

      const recipeID = await Recipe.create(recipeObject);

      const imagesPromises = req.files.map((file) => {
        return File.create({ name: file.filename, path: file.path });
      });

      let results = await Promise.all(imagesPromises);

      const filesID = results.map((file) => file);

      //INSERT INTO recipe_files
      const populateRecipeFiles = filesID.map((fileID) =>
        RecipesFiles.savingRecipeFiles(fileID, recipeID)
      );

      await Promise.all(populateRecipeFiles);

      //rendering all the elements for the index page
      results = await Recipe.find({
        where: { user_id: req.session.userID },
      });
      //Showing only one recipe instead of one recipe per file.
      let recipes = renderingRecipesWithOnlyOneFile(results);

      recipes = formatPath(recipes, req);

      return res.render(`admin/home/index`, {
        success: 'Receita criada com sucesso!',
        recipes: recipes,
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
        error: 'Erro inesperado!',
        recipes: recipes,
        userIsAdmin: req.user.is_admin,
      });
    }
  },

  async put(req, res) {
    try {
      const recipeObj = {
        chef_id: req.recipe.chef_id,
        user_id: req.user.id,
        title: req.recipe.title,
        ingredients: arrayDB(req.recipe.ingredients),
        preparation: arrayDB(req.recipe.preparation),
        information: req.recipe.information,
      };

      const recipeID = await Recipe.update({ id: req.recipe.id }, recipeObj);

      //deleting files from DB and server
      if (req.imagesRemoved.length > 0) {
        const promisesFilesPath = req.imagesRemoved.map((fileID) => {
          return File.show(fileID);
        });

        let results = await Promise.all(promisesFilesPath);

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
          return File.create({ name: file.filename, path: file.path });
        });

        results = await Promise.all(promisesOfSavingFiles);

        const promisesRecipeFiles = results.map((filesId) => {
          return RecipesFiles.savingRecipeFiles(filesId, recipeID);
        });

        await Promise.all(promisesRecipeFiles);
      }

      //rendering all the elements for the index page
      results = await Recipe.find({
        where: { user_id: req.session.userID },
      });
      //Showing only one recipe instead of one recipe per file.
      let recipes = renderingRecipesWithOnlyOneFile(results);

      recipes = formatPath(recipes, req);

      return res.render(`admin/home/index`, {
        success: 'Receita atualizada com sucesso!',
        recipes: recipes,
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
        error: 'Erro inesperado!',
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

      //deleting recipe from db
      await Recipe.delete(id);
      const promisesDeletingFiles = filesID.map((fileID) =>
        File.delete(fileID)
      );
      //deleting files from db
      await Promise.all(promisesDeletingFiles);

      //deleting images from server
      if (filesPath) {
        filesPath.forEach((filePath) => fs.unlinkSync(filePath));
      }

      //rendering all the elements for the index page
      results = await Recipe.find({
        where: { user_id: req.session.userID },
      });
      //Showing only one recipe instead of one recipe per file.
      let recipes = renderingRecipesWithOnlyOneFile(results);

      recipes = formatPath(recipes, req);

      return res.render(`admin/home/index`, {
        success: 'Receita deletada com sucesso!',
        recipes: recipes,
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
        error: 'Erro inesperado!',
        recipes: recipes,
        userIsAdmin: req.user.is_admin,
      });
    }
  },
};
