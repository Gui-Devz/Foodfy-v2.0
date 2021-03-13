const crypto = require("crypto");
const User = require("../models/user");

const { removingWhiteSpacesInBeginningAndEnding } = require("../../lib/utils");

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
      const { name, email, is_admin } = req.body;

      const password = crypto.randomBytes(5).toString("hex");

      let user = {
        name: removingWhiteSpacesInBeginningAndEnding(name),
        email: removingWhiteSpacesInBeginningAndEnding(email),
        password: password,
        is_admin: is_admin ? true : false,
      };

      await User.saving(user);

      //console.log(user);
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
