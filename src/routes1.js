const express = require("express");
const multer = require("./app/middlewares/multer");
const admin = require("./app/controllers/admin");
const recipes = require("./app/controllers/recipes");
const chefs = require("./app/controllers/chefs");

const routes = express.Router();

// ADMIN-SESSION

//RECIPES PAGES
routes.get("/admin/recipes", admin.index);

routes.get("/admin/recipes/create", recipes.create);

routes.get("/admin/recipes/:id", recipes.showAdmin);

routes.get("/admin/recipes/:id/edit", recipes.edit);

//CHEFS PAGES
routes.get("/admin/chefs", chefs.listAdmin);

routes.get("/admin/chefs/create", chefs.create);

routes.get("/admin/chefs/:id", chefs.show);

routes.get("/admin/chefs/:id/edit", chefs.edit);

//ADMIN CHEFS FORM

routes.post("/admin/chefs", multer.array("avatar", 1), admin.postChef);
routes.put("/admin/chefs", multer.array("avatar", 1), admin.putChef);
routes.delete("/admin/chefs", admin.deleteChef);

//ADMIN RECIPES FORM

routes.post("/admin/recipes", multer.array("images", 5), admin.postRecipe);
routes.put("/admin/recipes", multer.array("images", 5), admin.putRecipe);
routes.delete("/admin/recipes", admin.deleteRecipe);

module.exports = routes;
