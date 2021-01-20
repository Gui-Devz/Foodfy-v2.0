const db = require("../../config/db");

module.exports = {
  showRecipeFiles(recipe_ID) {
    const query = `
        SELECT files.name, files.path
        FROM recipe_files LEFT JOIN files ON (recipe_files.file_id = files.id)
        WHERE recipe_files.recipe_id = $1
      `;

    return db.query(query, [recipe_ID]);
  },

  showChefAvatar(chef_ID) {
    const query = `
        SELECT files.name, files.path
        FROM chefs LEFT JOIN files ON (chefs.file_id = files.id)
        WHERE chefs.id = $1
      `;

    return db.query(query, [chef_ID]);
  },
};
