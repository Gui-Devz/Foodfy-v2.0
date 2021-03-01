const adminDB = require("../models/adminDB");

const {
  validationOfBlankForms,
  validationOfChefName,
} = require("../../lib/utils");

module.exports = {
  async post(req, res) {
    try {
      if (validationOfBlankForms(req.body))
        return res.send("fill all the fields");

      if (req.files.length === 0) return res.send("Send at least one image");

      let results = await adminDB.savingFile(
        req.files[0].filename,
        req.files[0].path
      );
      const fileID = results.rows[0].id;

      const chefName = validationOfChefName(req.body.name);
      results = await adminDB.createChef(chefName, fileID);
      const chefID = results.rows[0].id;

      return res.redirect(`/admin/chefs/${chefID}`);
    } catch (err) {
      console.error(err);
    }
  },

  async put(req, res) {
    try {
      console.log(req.body);
      if (validationOfBlankForms(req.body))
        return res.send("fill all the fields");

      if (req.body.file_id === 0 && req.files.length === 0)
        return res.send("Send at least one image");

      let results = "";

      if (req.files.length != 0) {
        //getting the old file path to delete from server.
        results = await File.showChefAvatar(req.body.id);
        const oldFile = results.rows[0];

        fs.unlinkSync(oldFile.path);

        results = await adminDB.updateFile(
          oldFile.id || 1,
          req.files[0].filename,
          req.files[0].path
        );
      }

      results = await adminDB.updateChef(req.body.id, req.body.name);

      const chefID = results.rows[0].id;

      return res.redirect(`/admin/chefs/${chefID}`);
    } catch (err) {
      console.error(err);
    }
  },

  async delete(req, res) {
    try {
      const { id, file_id, qt_recipes } = req.body;

      console.log(qt_recipes);

      if (qt_recipes === 0) {
        let results = await File.showChefAvatar(id);
        const file_path = results.rows[0].path;

        await adminDB.deleteChef(id);
        await adminDB.deleteFile(file_id);

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
