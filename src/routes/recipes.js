const express = require("express");
const recipesController = require("../app/controllers/recipesController");

const routes = express.Router();

//open to everyone

routes.get("/", recipesController.list);
routes.get("/:id", recipesController.show);

module.exports = routes;
