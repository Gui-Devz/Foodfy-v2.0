const Recipe = require("../models/recipe");

module.exports = {
  index(req, res) {
    return res.render("recipes/index");
  },

  about(req, res) {
    return res.render("recipes/about");
  },

  list(req, res) {
    return res.render("recipes/recipes", {});
  },

  show(req, res) {
    const { id } = req.params;

    return res.render("recipes/edit", {});
  },
};
