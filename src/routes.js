const express = require("express");
const admin = require("./app/controllers/admin");
const recipes = require("./app/controllers/recipes");
const chefs = require("./app/controllers/chefs");

const routes = express.Router();

routes.get("/", recipes.index);

routes.get("/about", recipes.about);

routes.get("/recipes", recipes.list);

routes.get("/recipes/:id", recipes.show);

routes.get("/chefs", chefs.chefsList);

// ADMIN SESSION

//RECIPES PAGES
routes.get("/admin/recipes", admin.index);

routes.get("/admin/recipes/create", admin.createRecipe);

routes.get("/admin/recipes/:id", admin.showRecipe);

routes.get("/admin/recipes/:id/edit", admin.editRecipe);

//CHEFS PAGES
routes.get("/admin/chefs", chefs.chefsListAdmin);

routes.get("/admin/chefs/create", chefs.create);

routes.get("/admin/chefs/:id", chefs.show);

routes.get("/admin/chefs/:id/edit", chefs.edit);

//ADMIN CHEFS FORM

routes.post("/admin/chefs", admin.postChef);

//ADMIN RECIPES FORM

routes.post("/admin/recipes", admin.post);
routes.put("/admin/recipes", admin.put);
routes.delete("/admin/recipes", admin.delete);

module.exports = routes;
