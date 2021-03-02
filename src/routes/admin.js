const express = require("express");
const multer = require("../app/middlewares/multer");
const adminController = require("../app/controllers/adminController");
const recipesController = require("../app/controllers/recipesController");
const chefsController = require("../app/controllers/chefsController");
const usersController = require("../app/controllers/usersController");
const profileController = require("../app/controllers/profileController");

const { isLogged, isAdmin } = require("../app/middlewares/validators/users");

const routes = express.Router();

routes.get("/", isLogged, adminController.index);

//PROFILE ROUTES
routes.get("/profile", isLogged, profileController.index);
routes.put("/profile", isLogged, profileController.put);

//USERS ROUTES
routes.get("/users", isAdmin, usersController.list);
routes.get("/users/create", isAdmin, usersController.create);
routes.get("/users/:id/edit", isAdmin, usersController.edit);

routes.post("/users", usersController.post);
routes.put("/users", usersController.put);
routes.delete("/users", usersController.delete);

//RECIPES ROUTES
routes.get("/recipes/create", isLogged, recipesController.create);
routes.get("/recipes/:id", isLogged, adminController.showRecipe);
routes.get("/recipes/:id/edit", isLogged, recipesController.edit);

routes.post(
  "/recipes",
  isLogged,
  multer.array("images", 5),
  recipesController.post
);
routes.put(
  "/recipes",
  isLogged,
  multer.array("images", 5),
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
  isLogged,
  multer.array("avatar", 1),
  chefsController.post
);
routes.put("/chefs", isLogged, multer.array("avatar", 1), chefsController.put);
routes.delete("/chefs", isLogged, chefsController.delete);

module.exports = routes;
