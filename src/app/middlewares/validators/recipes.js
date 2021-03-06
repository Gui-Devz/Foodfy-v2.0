const {
  validationOfBlankFields,
  validationOfRecipeInputs,
  renderingRecipesWithOnlyOneFile,
  formatPath,
} = require("../../../lib/utils");

const Chef = require("../../models/chef");
const Admin = require("../../models/admin");
const Recipe = require("../../models/recipe");

async function checkInputImagesForPost(req, res, next) {
  try {
    //Validation of quantity of images sent
    if (req.files.length === 0) {
      return res.render("/admin/recipes/create", {
        error: "Por favor! envie ao menos uma imagem!",
        recipe: req.body,
        chefs: req.chefs,
      });
    }

    //making sure that the maximum images sent is 5!
    if (req.files.length > 5) {
      return res.render("/admin/recipes/edit", {
        error: "Por favor! envie no máximo 5 imagens!",
        recipe: req.body,
        chefs: req.chefs,
      });
    }

    next();
  } catch (error) {
    console.error(error);
    let results = await Recipe.find({ where: { user_id: req.session.userID } });
    //Showing only one recipe instead of one recipe per file.
    let recipes = renderingRecipesWithOnlyOneFile(results);

    recipes = formatPath(recipes, req);
    return res.render(`admin/home/index`, {
      error: "Erro inesperado!",
      recipes: recipes,
    });
  }
}

async function checkInputImagesForPut(req, res, next) {
  try {
    const { removed_files } = req.body;

    const results = await Admin.showAllRecipesFiles(req.body.id);
    const recipesFiles = results.rows;

    /*
    Making an array out of a string in req.body.removed_files
    and popping its last index because it's a comma.
    */
    let imagesRemoved = removed_files.split(",");
    imagesRemoved.pop();

    if (imagesRemoved.length >= recipesFiles.length && req.files.length === 0) {
      return res.render(`admin/recipes/edit`, {
        error: "Por favor, envie ao menos uma imagem!",
        recipe: req.body,
        chefs: req.chefs,
      });
    }

    //making sure that the maximum images sent is 5!
    const totalImagesSent = recipesFiles.length + req.files.length;
    if (totalImagesSent > 5) {
      return res.render("/admin/recipes/edit", {
        error: "Por favor! envie no máximo 5 imagens!",
        recipe: req.body,
        chefs: req.chefs,
      });
    }

    req.imagesRemoved = imagesRemoved;

    next();
  } catch (error) {
    console.error(error);
    let results = await Recipe.find({ where: { user_id: req.session.userID } });
    //Showing only one recipe instead of one recipe per file.
    let recipes = renderingRecipesWithOnlyOneFile(results);

    recipes = formatPath(recipes, req);
    return res.render(`admin/home/index`, {
      error: "Erro inesperado!",
      recipes: recipes,
    });
  }
}

async function checkInputFields(req, res, next) {
  try {
    const { ingredients, preparation } = req.body;

    const result = await Chef.chefsIdAndNames();
    const chefs = result.rows;

    if (validationOfBlankFields(req.body)) {
      return res.render("admin/recipes/create", {
        error: "Por favor, preencha todos os campos!",
        recipe: req.body,
        chefs,
      });
    }
    const createdRecipe = {
      ...req.body,
      ingredients: validationOfRecipeInputs(ingredients),
      preparation: validationOfRecipeInputs(preparation),
    };

    req.recipe = createdRecipe;
    req.chefs = chefs;

    next();
  } catch (error) {
    console.error(error);
    let results = await Recipe.find({ where: { user_id: req.session.userID } });
    //Showing only one recipe instead of one recipe per file.
    let recipes = renderingRecipesWithOnlyOneFile(results);

    recipes = formatPath(recipes, req);
    return res.render(`admin/home/index`, {
      error: "Erro inesperado!",
      recipes: recipes,
    });
  }
}

async function checkIfRecipesExists(req, res, next) {
  const results = await Recipe.find();

  //Showing only one recipe instead of one recipe per file.
  let recipes = renderingRecipesWithOnlyOneFile(results);

  recipes = formatPath(recipes, req);

  const recipesID = recipes.map((recipe) => recipe.id);
  // console.log(recipesID);
  // console.log(req.params.id);
  const found = recipesID.some((recipeID) => {
    if (recipeID == req.params.id) {
      return recipeID;
    }
  });

  if (!found) {
    return res.render("admin/home/index", {
      error: "Essa receita não existe no banco de dados!",
      recipes: recipes,
    });
  }

  next();
}

module.exports = {
  checkInputFields,
  checkInputImagesForPost,
  checkInputImagesForPut,
  checkIfRecipesExists,
};
