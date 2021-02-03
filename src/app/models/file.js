const db = require("../../config/db");

module.exports = {
  showRecipeFiles(recipe_ID) {
    const query = `
        SELECT files.id AS file_id, files.name AS file_name, files.path AS file_path
        FROM recipe_files LEFT JOIN files ON (recipe_files.file_id = files.id)
        WHERE recipe_files.recipe_id = $1
      `;

    return db.query(query, [recipe_ID]);
  },

  showAllFiles() {
    const query = `SELECT recipe_files.recipe_id,files.name AS file_name, files.path AS file_path
    FROM recipe_files LEFT JOIN files ON (recipe_files.file_id = files.id)`;

    return db.query(query);
  },

  showChefAvatar(chef_ID) {
    const query = `
        SELECT files.*
        FROM chefs LEFT JOIN files ON (chefs.file_id = files.id)
        WHERE chefs.id = $1
      `;

    return db.query(query, [chef_ID]);
  },

  showFile(fileID) {
    const query = `
        SELECT files.id AS file_id, files.name AS file_name, files.path AS file_path
        FROM recipe_files LEFT JOIN files ON (recipe_files.file_id = files.id)
        WHERE recipe_files.file_id = $1
      `;

    return db.query(query, [fileID]);
  },
};
