const express = require("express");
const multer = require("../app/middlewares/multer");
const adminController = require("../app/controllers/adminController");
const recipesController = require("../app/controllers/recipesController");
const chefsController = require("../app/controllers/chefsController");
const usersController = require("../app/controllers/usersController");
const profileController = require("../app/controllers/profileController");

const sessionController = require("../app/controllers/sessionController");
const { login } = require("../app/middlewares/validators/session");
const { isLogged, isAdmin } = require("../app/middlewares/validators/users");

const routes = express.Router();

routes.get("/", isLogged, adminController.index);

//SESSION ROUTES
routes.get("/login", sessionController.loginForm);
routes.post("/login", login, sessionController.login);
routes.get("/logout", sessionController.logout);

//USERS ROUTES
routes.get("/profile", isLogged, profileController.index);
routes.get("/users", isLogged, adminController.listUsers);

//RECIPES ROUTES
routes.get("/recipes/create", isLogged, recipesController.create);
routes.get("/recipes/:id", isLogged, adminController.showRecipe);
routes.get("/recipes/:id/edit", isLogged, recipesController.edit);

//CHEFS ROUTES
routes.get("/chefs", isLogged, adminController.listChef);
routes.get("/chefs/create", isAdmin, adminController.createChef);
routes.get("/chefs/:id", isLogged, adminController.showChef);
routes.get("/chefs/:id/edit", isAdmin, adminController.editChef);

//ADMIN RECIPES FORM
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

//ADMIN CHEFS FORM
routes.post(
  "/chefs",
  isLogged,
  multer.array("avatar", 1),
  chefsController.post
);
routes.put("/chefs", isLogged, multer.array("avatar", 1), chefsController.put);
routes.delete("/chefs", isLogged, chefsController.delete);

module.exports = routes;
