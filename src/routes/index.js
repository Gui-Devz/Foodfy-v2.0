const express = require("express");
const chefsController = require("../app/controllers/chefsController");

const routes = express.Router();

const homeController = require("../app/controllers/homeController");

const users = require("./users");
const recipes = require("./recipes");
const admin = require("./admin");

// HOME
routes.get("/", homeController.index);

routes.use("/recipes", recipes);
//routes.use("/users", users);
routes.use("/admin", admin);

// Alias
routes.get("/accounts", (req, res) => {
  return res.redirect("/users/login");
});

routes.get("/about", (req, res) => {
  return res.render("main/home/about");
});

routes.get("/chefs", chefsController.list);

module.exports = routes;
