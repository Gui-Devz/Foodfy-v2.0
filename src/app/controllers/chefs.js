const Chef = require("../models/chef");
const adminDB = require("../models/adminDB");

module.exports = {
  chefsListAdmin(req, res) {
    Chef.showChefs(function (chefs) {
      return res.render("admin/chefs/list", { chefs });
    });
  },

  chefsList(req, res) {
    Chef.showChefs(function (chefs) {
      return res.render("recipes/chefs/list", { chefs });
    });
  },

  create(req, res) {
    return res.render("admin/chefs/create");
  },

  show(req, res) {
    const { id } = req.params;

    Chef.showChef(id, function (chef) {
      Chef.showChefsRecipes(id, function (recipes) {
        return res.render("admin/chefs/show", { chef, recipes });
      });
    });
  },
};
