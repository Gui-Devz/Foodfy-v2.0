const express = require("express");
const multer = require("../app/middlewares/multer");
const adminController = require("../app/controllers/adminController");
const recipesController = require("../app/controllers/recipesController");
const chefsController = require("../app/controllers/chefsController");

const routes = express.Router();

routes.get("/", adminController.index);

//ADMIN RECIPES FORM
routes.post("/recipes", multer.array("images", 5), recipesController.post);
routes.put("/recipes", multer.array("images", 5), recipesController.put);
routes.delete("/recipes", recipesController.delete);

//ADMIN CHEFS FORM
routes.post("/chefs", multer.array("avatar", 1), chefsController.post);
routes.put("/chefs", multer.array("avatar", 1), chefsController.put);
routes.delete("/chefs", chefsController.delete);

module.exports = routes;
