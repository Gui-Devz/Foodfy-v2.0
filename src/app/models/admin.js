const db = require("../../config/db");
const { hash } = require("bcryptjs");
const { arrayDB } = require("../../lib/utils");

module.exports = {
  deleteRecipeFromRecipeFiles(recipeID) {
    const query = `DELETE FROM recipe_files WHERE recipe_files.recipe_id = $1`;

    return db.query(query, [recipeID]);
  },

  savingRecipeFiles(FileID, RecipeID) {
    const query = `
            INSERT INTO recipe_files (
              recipe_id,
              file_id
            ) VALUES ($1, $2)`;

    return db.query(query, [RecipeID, FileID]);
  },

  deleteFilesFromRecipeFiles(fileID) {
    const query = `
      DELETE FROM recipe_files WHERE recipe_files.file_id = $1
    `;
    return db.query(query, [fileID]);
  },
};
