const adminDB = require("../models/adminDB");
const { showChef, showChefsRecipes, showChefs } = require("../models/chef");
const { formatPath } = require("../../lib/utils");

module.exports = {
  async listAdmin(req, res) {
    const result = await showChefs();
    const chefsWithAvatarFormated = formatPath(result.rows, req);

    return res.render("admin/chefs/list", { chefs: chefsWithAvatarFormated });
  },

  async list(req, res) {
    const result = await Chef.showChefs();
    const chefsWithAvatarFormated = formatPath(result.rows, req);

    return res.render("user/chefs/list", { chefs: chefsWithAvatarFormated });
  },

  create(req, res) {
    return res.render("admin/chefs/create");
  },

  async show(req, res) {
    const { id } = req.params;

    let result = await showChef(id);
    const chefWithAvatarPathFormated = formatPath(result.rows, req);

    result = await showChefsRecipes(id);
    const chefsRecipesPathFormated = formatPath(result.rows, req);

    return res.render("admin/chefs/show", {
      chef: chefWithAvatarPathFormated,
      recipes: chefsRecipesPathFormated,
    });
  },

  async edit(req, res) {
    const { id } = req.params;

    Chef.showChef(id, function (chef) {
      let recipes = false;
      if (chef.qt_recipes != 0) {
        recipes = true;
      } else {
        recipes = false;
      }

      console.log(recipes);

      return res.render("admin/chefs/edit", { chef, recipes });
    });
  },
};
