const adminDB = require("../models/adminDB");
const { showChef, showChefsRecipes, showChefs } = require("../models/chef");
const {
  formatPath,
  filteringRecipesWithOnlyOneFile,
} = require("../../lib/utils");

module.exports = {
  async listAdmin(req, res) {
    try {
      const result = await showChefs();
      const chefsWithAvatarFormated = formatPath(result.rows, req);

      return res.render("admin/chefs/list", { chefs: chefsWithAvatarFormated });
    } catch (err) {
      console.error(err);
    }
  },

  async list(req, res) {
    try {
      const result = await showChefs();
      const chefsWithAvatarFormated = formatPath(result.rows, req);

      return res.render("user/chefs/list", { chefs: chefsWithAvatarFormated });
    } catch (err) {
      console.error(err);
    }
  },

  create(req, res) {
    return res.render("admin/chefs/create");
  },

  async show(req, res) {
    try {
      const { id } = req.params;

      let result = await showChef(id);
      const chefWithAvatarPathFormated = formatPath(result.rows, req);

      result = await showChefsRecipes(id);
      let recipes = formatPath(result.rows, req);

      recipes = filteringRecipesWithOnlyOneFile(recipes);

      return res.render("admin/chefs/show", {
        chef: chefWithAvatarPathFormated[0],
        recipes,
      });
    } catch (err) {
      console.error(err);
    }
  },

  async edit(req, res) {
    try {
      const { id } = req.params;

      let result = await showChef(id);
      const chefWithAvatarPathFormated = formatPath(result.rows, req);

      return res.render("admin/chefs/edit", {
        chef: chefWithAvatarPathFormated[0],
      });
    } catch (err) {
      console.error(err);
    }
  },
};
