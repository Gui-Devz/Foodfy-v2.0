const db = require("../../config/db");

module.exports = {
  savingRecipeFiles(fileID, recipeID) {
    const query = `
            INSERT INTO recipe_files (
              recipe_id,
              file_id
            ) VALUES ($1, $2)`;

    return db.query(query, [recipeID, fileID]);
  },

  showAllRecipesFiles(recipeID) {
    const query = `
            SELECT * FROM recipe_files
            WHERE recipe_id=$1
            `;

    return db.query(query, [recipeID]);
  },
};
