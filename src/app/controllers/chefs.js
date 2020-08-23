const Chef = require("../models/chef");
const adminDB = require("../models/adminDB");

module.exports = {
  chefsList(req, res) {
    Chef.showChefs(function (chefs) {
      return res.render("chefs/list", { chefs });
    });
  },

  create(req, res) {
    return res.render("chefs/create");
  },

  show(req, res) {
    const { id } = req.params;

    Chef.showChef(id, function (chef) {
      Chef.showChefsRecipes(id, function (recipes) {
        return res.render("chefs/show", { chef, recipes });
      });
    });
  },
};
