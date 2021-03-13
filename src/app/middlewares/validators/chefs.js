const {
  validationOfBlankFields,
  renderingRecipesWithOnlyOneFile,
} = require("../../../lib/utils");
const Chef = require("../../models/chef");
const Recipe = require("../../models/recipe");

async function checkInputFieldsChef(req, res, next) {
  try {
    // console.log(req.body);
    if (validationOfBlankFields(req.body)) {
      return res.render("admin/chefs/edit", {
        error: "Por favor, preencha todos os campos!",
        chef: req.body,
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

async function checkImageBeforePostChef(req, res, next) {
  try {
    // console.log(req.body.file_id);
    if (req.files.length === 0 && req.body.file_id === 0) {
      return res.render("admin/chefs/edit", {
        error: "Por favor, envie ao menos uma imagem!",
        chef: req.body,
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

async function checkIfChefHasRecipeBeforeDelete(req, res, next) {
  try {
    const result = await Chef.quantityOfRecipes(req.body.id);
    const chef = result.rows[0];

    console.log(chef);

    if (chef.qt_recipes != 0) {
      return res.render("admin/chefs/edit", {
        error: "Não é permitido deletar chefs que tenham receitas!",
        chef: chef,
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

module.exports = {
  checkInputFieldsChef,
  checkImageBeforePostChef,
  checkIfChefHasRecipeBeforeDelete,
};