const express = require("express");
const admin = require("./app/controllers/admin");
const recipes = require("./app/controllers/recipes");
const chefs = require("./app/controllers/chefs");

const routes = express.Router();

routes.get("/index", recipes.index);

routes.get("/about", recipes.about);

routes.get("/recipes", recipes.list);

routes.get("/recipes/:id", recipes.show);

routes.get("/chefs", chefs.list);

// ADMIN-SESSION

//RECIPES PAGES
routes.get("/admin/recipes", admin.index);

routes.get("/admin/recipes/create", recipes.create);

routes.get("/admin/recipes/:id", recipes.show);

routes.get("/admin/recipes/:id/edit", recipes.edit);

//CHEFS PAGES
routes.get("/admin/chefs", chefs.listAdmin);

routes.get("/admin/chefs/create", chefs.create);

routes.get("/admin/chefs/:id", chefs.show);

routes.get("/admin/chefs/:id/edit", chefs.edit);

//ADMIN CHEFS FORM

routes.post("/admin/chefs", admin.postChef);
routes.put("/admin/chefs", admin.putChef);
routes.delete("/admin/chefs", admin.deleteChef);

//ADMIN RECIPES FORM

routes.post("/admin/recipes", admin.postRecipe);
routes.put("/admin/recipes", admin.putRecipe);
routes.delete("/admin/recipes", admin.deleteRecipe);

module.exports = routes;
