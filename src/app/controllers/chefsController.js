const Admin = require("../models/admin");
const File = require("../models/file");
const Chef = require("../models/chef");
const {
  formatPath,
  validationOfBlankFields,
  validationOfChefName,
  renderingRecipesWithOnlyOneFile,
} = require("../../lib/utils");

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
      if (validationOfBlankFields(req.body))
        return res.send("fill all the fields");

      if (req.files.length === 0) return res.send("Send at least one image");

      let results = await File.saving(req.files[0].filename, req.files[0].path);
      const fileID = results.rows[0].id;

      const chefName = validationOfChefName(req.body.name);
      results = await Chef.saving(chefName, fileID);
      const chefID = results.rows[0].id;

      return res.redirect(`/admin/chefs/${chefID}`);
    } catch (err) {
      console.error(err);
    }
  },

  async put(req, res) {
    try {
      console.log(req.body);
      if (validationOfBlankFields(req.body))
        return res.send("fill all the fields");

      if (req.body.file_id === 0 && req.files.length === 0)
        return res.send("Send at least one image");

      let results = "";

      if (req.files.length != 0) {
        //getting the old file path to delete from server.
        results = await File.showChefAvatar(req.body.id);
        const oldFile = results.rows[0];

        fs.unlinkSync(oldFile.path);

        results = await File.update(
          oldFile.id || 1,
          req.files[0].filename,
          req.files[0].path
        );
      }

      results = await Chef.update(req.body.id, req.body.name);

      const chefID = results.rows[0].id;

      return res.redirect(`/admin/chefs/${chefID}`);
    } catch (err) {
      console.error(err);
    }
  },

  async delete(req, res) {
    try {
      const { id, file_id, qt_recipes } = req.body;

      // console.log(qt_recipes);

      if (qt_recipes === 0) {
        let results = await File.showChefAvatar(id);
        const file_path = results.rows[0].path;

        await Chef.delete(id);
        await File.delete(file_id);

        fs.unlinkSync(file_path);

        return res.redirect("/admin/chefs");
      } else {
        return res.send("You cannot delete a chef who has recipes!");
      }
    } catch (err) {
      console.error(err);
    }
  },
};
