const { validationOfBlankFields } = require("../../../lib/utils");
const Chef = require("../../models/chef");

function checkInputFieldsChef(req, res, next) {
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
    return res.render("admin/home/index", { error: "Erro inesperado!" });
  }
}

function checkImageBeforePostChef(req, res, next) {
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
    return res.render("admin/home/index", { error: "Erro inesperado!" });
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
    return res.render("admin/home/index", { error: "Erro inesperado!" });
  }
}

module.exports = {
  checkInputFieldsChef,
  checkImageBeforePostChef,
  checkIfChefHasRecipeBeforeDelete,
};
