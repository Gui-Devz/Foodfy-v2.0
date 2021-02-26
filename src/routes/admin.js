const express = require("express");
const multer = require("../app/middlewares/multer");
const adminController = require("../app/controllers/adminController");
const recipesController = require("../app/controllers/recipesController");
const chefsController = require("../app/controllers/chefsController");
const usersController = require("../app/controllers/usersController");

const routes = express.Router();

routes.get("/", adminController.index);

//USERS ROUTES
routes.get("/profile", usersController.index);

//RECIPES ROUTES
routes.get("/recipes", adminController.index);
routes.get("/recipes/create", recipesController.create);
routes.get("/recipes/:id", recipesController.showAdmin);
routes.get("/recipes/:id/edit", recipesController.edit);

//CHEFS ROUTES
routes.get("/chefs", chefsController.listAdmin);
routes.get("/chefs/create", chefsController.create);
routes.get("/chefs/:id", chefsController.show);
routes.get("/chefs/:id/edit", chefsController.edit);

//ADMIN RECIPES FORM
routes.post("/recipes", multer.array("images", 5), recipesController.post);
routes.put("/recipes", multer.array("images", 5), recipesController.put);
routes.delete("/recipes", recipesController.delete);

//ADMIN CHEFS FORM
routes.post("/chefs", multer.array("avatar", 1), chefsController.post);
routes.put("/chefs", multer.array("avatar", 1), chefsController.put);
routes.delete("/chefs", chefsController.delete);

module.exports = routes;
