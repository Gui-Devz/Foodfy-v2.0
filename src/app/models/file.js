const db = require("../../config/db");

module.exports = {
  showRecipeFiles(recipe_ID) {
    try {
      const query = `
          SELECT files.id AS file_id, files.name AS file_name, files.path AS file_path
          FROM recipe_files LEFT JOIN files ON (recipe_files.file_id = files.id)
          WHERE recipe_files.recipe_id = $1
        `;

      return db.query(query, [recipe_ID]);
    } catch (error) {
      console.error(error);
    }
  },

  showAll() {
    try {
      const query = `SELECT recipe_files.recipe_id,files.name AS file_name, files.path AS file_path
      FROM recipe_files LEFT JOIN files ON (recipe_files.file_id = files.id)`;

      return db.query(query);
    } catch (error) {
      console.error(error);
    }
  },

  showChefAvatarFile(chef_ID) {
    try {
      const query = `
          SELECT files.*
          FROM chefs LEFT JOIN files ON (chefs.file_id = files.id)
          WHERE chefs.id = $1
        `;

      return db.query(query, [chef_ID]);
    } catch (error) {
      console.error(error);
    }
  },

  show(fileID) {
    try {
      const query = `
          SELECT files.id AS file_id, files.name AS file_name, files.path AS file_path
          FROM recipe_files LEFT JOIN files ON (recipe_files.file_id = files.id)
          WHERE recipe_files.file_id = $1
        `;

      return db.query(query, [fileID]);
    } catch (error) {
      console.error(error);
    }
  },

  saving(filename, filePath) {
    try {
      const query = `
              INSERT INTO files (
                  name,
                  path
              ) VALUES ($1, $2)
              RETURNING id
          `;

      return db.query(query, [filename, filePath]);
    } catch (error) {
      console.error(error);
    }
  },

  update(id, name, filePath) {
    try {
      const query = `
          UPDATE files SET
            name = $1,
            path = $2
          WHERE id = $3
          RETURNING id`;

      let values = [name, filePath, id];

      return db.query(query, values);
    } catch (error) {
      console.error(error);
    }
  },

  delete(fileID) {
    try {
      const query = `DELETE FROM files WHERE id = $1`;

      return db.query(query, [fileID]);
    } catch (error) {
      console.error(error);
    }
  },
};
