const User = require("../../models/user");
const Recipe = require("../../models/recipe");

const {
  formatPath,
  validationOfBlankFields,
  renderingRecipesWithOnlyOneFile,
} = require("../../../lib/utils");

async function login(req, res, next) {
  try {
    if (req.session.userID) {
      const user = await User.find({ where: { id: req.session.userID } });

      if (user[0].is_admin) {
        const allUsers = await User.find();
        return res.render("admin/users/list", {
          success: "Você está logado!",
          users: allUsers,
          userIsAdmin: user[0].is_admin,
        });
      }

      req.user = user;
      return res.render("admin/users/profile", {
        success: "Você está logado!",
        user: user[0],
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
async function isLogged(req, res, next) {
  try {
    if (!req.session.userID) {
      const errorCreate =
        "Crie uma conta para ter acesso a essa funcionalidade!";
      return res.render("session/login", { error: errorCreate });
    }

    const user = await User.find({ where: { id: req.session.userID } });

    req.user = user[0];

    next();
  } catch (error) {
    console.error(error);
    let results = await Recipe.find({ where: { user_id: req.session.userID } });
    //Showing only one recipe instead of one recipe per file.
    let recipes = renderingRecipesWithOnlyOneFile(results);

    recipes = formatPath(recipes, req);
    return res.render(`main/home/index`, {
      error: "Erro inesperado!",
      recipes: recipes,
    });
  }
}
async function isAdmin(req, res, next) {
  try {
    const userID = req.session.userID;
    if (!userID) {
      const errorCreate =
        "Crie uma conta para ter acesso a essa funcionalidade!";
      return res.render("session/login", { error: errorCreate });
    }

    const user = await User.find({ where: { id: userID } });

    if (!user[0].is_admin) {
      let results = await Recipe.find({ where: { user_id: userID } });
      let recipes = formatPath(results, req);

      //Showing only one recipe instead of one recipe per file.
      recipes = renderingRecipesWithOnlyOneFile(recipes);
      const errorCreate = "Apenas o Admin tem acesso a essa funcionalidade!";
      return res.render("admin/home/index", {
        error: errorCreate,
        recipes: recipes,
      });
    }
    req.user = user[0];

    next();
  } catch (error) {
    console.error(error);
    let results = await Recipe.find({ where: { user_id: req.session.userID } });
    //Showing only one recipe instead of one recipe per file.
    let recipes = renderingRecipesWithOnlyOneFile(results);

    recipes = formatPath(recipes, req);
    return res.render(`main/home/index`, {
      error: "Erro inesperado!",
      recipes: recipes,
    });
  }
}
async function checkRecipeOwner(req, res, next) {
  try {
    if (!req.user.is_admin) {
      let results = await Recipe.find({
        where: { user_id: req.session.userID },
      });

      //Showing only one recipe instead of one recipe per file.
      let recipes = renderingRecipesWithOnlyOneFile(results, req);

      //console.log(recipes);
      const usersRecipesIds = recipes.map((recipe) => recipe.id);

      // console.log(usersRecipesIds);
      for (const recipeId of usersRecipesIds) {
        if (req.params.id != recipeId) {
          // console.log(req);
          recipes = formatPath(recipes, req);
          //console.log(recipes);

          return res.render("admin/home/index", {
            error: "Essa receita não é sua para editar!",
            recipes: recipes,
          });
        }
      }
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

async function checkingInputsBeforePosting(req, res, next) {
  try {
    if (validationOfBlankFields(req.body)) {
      return res.render("admin/users/create", {
        error: "Por favor, preencha todos os campos!",
        user: req.body,
        userIsAdmin: req.user.is_admin,
      });
    }

    next();
  } catch (error) {
    console.error(error);
    const allUsers = await User.find();
    return res.render("admin/users/list", {
      success: "Erro inesperado!",
      users: allUsers,
      userIsAdmin: user[0].is_admin,
    });
  }
}

module.exports = {
  isLogged,
  isAdmin,
  login,
  checkRecipeOwner,
  checkingInputsBeforePosting,
};
