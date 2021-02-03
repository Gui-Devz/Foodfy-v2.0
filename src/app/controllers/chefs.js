const adminDB = require("../models/adminDB");
const { showChef, showChefsRecipes, showChefs } = require("../models/chef");
const { formatPath } = require("../../lib/utils");

module.exports = {
  async listAdmin(req, res) {
    try {
      const result = await showChefs();
      const chefsWithAvatarFormated = formatPath(result.rows, req);

      return res.render("admin/chefs/list", { chefs: chefsWithAvatarFormated });
    } catch (err) {
      throw new Error(err);
    }
  },

  async list(req, res) {
    try {
      const result = await showChefs();
      const chefsWithAvatarFormated = formatPath(result.rows, req);

      return res.render("user/chefs/list", { chefs: chefsWithAvatarFormated });
    } catch (err) {
      throw new Error(err);
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
      const chefsRecipesPathFormated = formatPath(result.rows, req);

      //console.log(chefsRecipesPathFormated);

      return res.render("admin/chefs/show", {
        chef: chefWithAvatarPathFormated[0],
        recipes: chefsRecipesPathFormated,
      });
    } catch (err) {
      throw new Error(err);
    }
  },

  async edit(req, res) {
    try {
      const { id } = req.params;

      let result = await showChef(id);
      const chefWithFilePathFormated = formatPath(result.rows, req);

      return res.render("admin/chefs/edit", {
        chef: chefWithFilePathFormated[0],
      });
    } catch (err) {
      throw new Error(err);
    }
  },
};
