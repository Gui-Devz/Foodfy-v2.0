const express = require("express");
const admin = require("./app/controllers/admin");
const recipes = require("./app/controllers/recipes");

const routes = express.Router();

routes.get("/", recipes.index);

routes.get("/about", recipes.about);

routes.get("/recipes", recipes.list);

routes.get("/recipes/:id", recipes.show);

// ADMIN SESSION

routes.get("/admin/recipes", admin.index);

routes.get("/admin/recipes/create", admin.createRecipe);

routes.get("/admin/recipes/:id", admin.showRecipe);

routes.get("/admin/recipes/:id/edit", admin.editRecipe);

//ADMIN RECIPES FORM

routes.post("/admin/recipes", admin.post);
routes.put("/admin/recipes", admin.put);
routes.delete("/admin/recipes", admin.delete);

module.exports = routes;
