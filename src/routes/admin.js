const express = require("express");
const multer = require("../app/middlewares/multer");
const adminController = require("../app/controllers/adminController");
const recipesController = require("../app/controllers/recipesController");
const chefsController = require("../app/controllers/chefsController");
const usersController = require("../app/controllers/usersController");
const profileController = require("../app/controllers/profileController");

const {
  isLogged,
  isAdmin,
  recipeOwner,
} = require("../app/middlewares/validators/users");
const {
  checkInputFields,
  checkInputImagesForPost,
  checkInputImagesForPut,
} = require("../app//middlewares/validators/recipes");
const {
  checkInputFieldsChef,
  checkImageBeforePostChef,
  checkIfChefHasRecipeBeforeDelete,
} = require("../app//middlewares/validators/chefs");

const routes = express.Router();

routes.get("/", isLogged, adminController.index);

//PROFILE ROUTES
routes.get("/profile", isLogged, profileController.index);
routes.put("/profile", isLogged, profileController.put);

//USERS ROUTES
routes.get("/users", isAdmin, usersController.list);
routes.get("/users/create", isAdmin, usersController.create);
routes.get("/users/:id/edit", isAdmin, usersController.edit);

routes.post("/users", isAdmin, usersController.post);
routes.put("/users", isAdmin, usersController.put);
routes.delete("/users", isAdmin, usersController.delete);

//RECIPES ROUTES
routes.get("/recipes/create", isLogged, recipesController.create);
routes.get("/recipes/:id", isLogged, adminController.showRecipe);
routes.get("/recipes/:id/edit", isLogged, recipeOwner, recipesController.edit);

routes.post(
  "/recipes",
  isLogged,
  multer.array("images", 5),
  checkInputFields,
  checkInputImagesForPost,
  recipesController.post
);
routes.put(
  "/recipes",
  isLogged,
  multer.array("images", 5),
  checkInputFields,
  checkInputImagesForPut,
  recipesController.put
);
routes.delete("/recipes", isLogged, recipesController.delete);

//CHEFS ROUTES
routes.get("/chefs", isLogged, adminController.listChef);
routes.get("/chefs/create", isAdmin, chefsController.create);
routes.get("/chefs/:id", isLogged, chefsController.show);
routes.get("/chefs/:id/edit", isAdmin, chefsController.edit);

routes.post(
  "/chefs",
  isAdmin,
  multer.array("avatar", 1),
  checkInputFieldsChef,
  checkImageBeforePostChef,
  chefsController.post
);
routes.put(
  "/chefs",
  isAdmin,
  multer.array("avatar", 1),
  checkInputFieldsChef,
  chefsController.put
);
routes.delete(
  "/chefs",
  isAdmin,
  checkIfChefHasRecipeBeforeDelete,
  chefsController.delete
);

module.exports = routes;
