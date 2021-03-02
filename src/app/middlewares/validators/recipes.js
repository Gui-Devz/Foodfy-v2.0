const {
  validationOfBlankFields,
  validationOfRecipeInputs,
} = require("../../../lib/utils");

const Chef = require("../../models/chef");
const Admin = require("../../models/admin");

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
    return res.render("admin/home/index", { error: "Erro inesperado!" });
  }
}

async function checkInputImagesForPut(req, res, next) {
  try {
    const { removed_files } = req.body;

    const results = await Admin.showAllRecipesFiles(req.body.id);
    const recipes = results.rows;

    /*
      Making an array out of a string in req.body.removed_files
    and popping its last index because it's a comma.
    */
    const imagesRemoved = removed_files.split(",").pop();
    // imagesRemoved.pop();

    if (imagesRemoved.length >= recipes.length && req.files.length === 0) {
      return res.render("/admin/recipes/edit", {
        error: "Por favor! envie ao menos uma imagem!",
        recipe: req.body,
        chefs: req.chefs,
      });
    }

    //making sure that the maximum images sent is 5!
    const totalImagesSent = recipes.length + req.files.length;
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
    return res.render("admin/home/index", { error: "Erro inesperado!" });
  }
}

async function checkInputFields(req, res, next) {
  try {
    const { ingredients, preparation } = req.body;

    const result = await Chef.chefsIdAndNames();
    const chefs = result.rows;
    console.log(req.body);

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
    return res.render("admin/home/index", { error: "Erro inesperado!" });
  }
}

module.exports = {
  checkInputFields,
  checkInputImagesForPost,
  checkInputImagesForPut,
};
