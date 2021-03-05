const Admin = require("../models/admin");
const File = require("../models/file");
const Chef = require("../models/chef");
const {
  formatPath,
  validationOfBlankFields,
  validationOfChefName,
  renderingRecipesWithOnlyOneFile,
} = require("../../lib/utils");

const fs = require("fs");

module.exports = {
  async list(req, res) {
    try {
      const results = await Chef.show();
      const chefsWithAvatarPathFormated = formatPath(results, req);

      return res.render("main/chefs/list", {
        chefs: chefsWithAvatarPathFormated,
        userLogged: req.user,
      });
    } catch (err) {
      console.error(err);
    }
  },

  create(req, res) {
    return res.render("admin/chefs/create", { userIsAdmin: req.user.is_admin });
  },

  async show(req, res) {
    try {
      const { id } = req.params;

      let results = await Chef.show({ where: { "chefs.id": id } });
      const chefWithAvatarPathFormated = formatPath(results, req);

      results = await Chef.showChefsRecipes(id);
      let recipes = formatPath(results.rows, req);

      recipes = renderingRecipesWithOnlyOneFile(recipes);

      return res.render("admin/chefs/show", {
        chef: chefWithAvatarPathFormated[0],
        recipes,
        userIsAdmin: req.user.is_admin,
      });
    } catch (err) {
      console.error(err);
    }
  },

  async edit(req, res) {
    try {
      const { id } = req.params;

      let result = await Chef.show({ where: { "chefs.id": id } });
      const chefWithAvatarPathFormated = formatPath(result, req);

      return res.render("admin/chefs/edit", {
        chef: chefWithAvatarPathFormated[0],
        userIsAdmin: req.user.is_admin,
      });
    } catch (err) {
      console.error(err);
    }
  },

  async post(req, res) {
    try {
      let results = await File.saving(req.files[0].filename, req.files[0].path);
      const fileID = results.rows[0].id;
      console.log(fileID);

      const chefName = validationOfChefName(req.body.name);
      results = await Chef.saving(chefName, fileID);
      const chefID = results.rows[0].id;

      return res.redirect(`/admin/chefs/${chefID}`);
    } catch (err) {
      console.error(err);
      return res.render(`admin/home/index`, {
        error: "Erro inesperado!",
      });
    }
  },

  async put(req, res) {
    try {
      let results = "";

      if (req.files.length != 0) {
        //getting the old file path to delete from server.
        results = await File.showChefAvatarFile(req.body.id);
        const oldFile = results.rows[0];

        fs.unlinkSync(oldFile.path);

        results = await File.update(
          oldFile.id,
          req.files[0].filename,
          req.files[0].path
        );
      }

      results = await Chef.update(req.body.id, req.body.name);

      const chefID = results.rows[0].id;

      return res.redirect(`/admin/chefs/${chefID}`);
    } catch (err) {
      console.error(err);
      return res.render(`admin/home/index`, {
        error: "Erro inesperado!",
      });
    }
  },

  async delete(req, res) {
    try {
      const { id, file_id, qt_recipes } = req.body;

      // console.log(qt_recipes);

      let results = await File.showChefAvatarFile(id);
      const file_path = results.rows[0].path;

      await Chef.delete(id);
      await File.delete(file_id);

      fs.unlinkSync(file_path);

      return res.redirect("/admin/chefs");
    } catch (err) {
      console.error(err);
      return res.render(`admin/home/index`, {
        error: "Erro inesperado!",
      });
    }
  },
};
