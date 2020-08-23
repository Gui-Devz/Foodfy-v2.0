const Chef = require("../models/chef");

module.exports = {
  chefsList(req, res) {
    Chef.showChefs(function (chefs) {
      return res.render("chefs/list", { chefs });
    });
  },

  create(req, res) {
    return res.render("chefs/create");
  },
};
