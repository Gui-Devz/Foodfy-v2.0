const User = require("../models/user");

const {
  validationOfBlankFields,
  validationOfChefName,
  formatPath,
} = require("../../lib/utils");

module.exports = {
  async list(req, res) {
    try {
      const users = await User.find();

      // console.log(users);

      return res.render("admin/users/list", {
        users: users,
        userIsAdmin: req.user.is_admin,
      });
    } catch (err) {
      console.error(err);
    }
  },

  async edit(req, res) {
    const { id } = req.params;

    const user = await User.find({ where: { id } });

    return res.render("admin/users/edit", {
      userIsAdmin: req.user.is_admin,
      user: user[0],
    });
  },

  async create(req, res) {
    return res.render("admin/users/create", {
      userIsAdmin: req.user.is_admin,
    });
  },
  async post(req, res) {
    try {
    } catch (err) {
      console.error(err);
    }
  },

  async put(req, res) {
    try {
    } catch (err) {
      console.error(err);
    }
  },

  async delete(req, res) {
    try {
    } catch (err) {
      console.error(err);
    }
  },
};
