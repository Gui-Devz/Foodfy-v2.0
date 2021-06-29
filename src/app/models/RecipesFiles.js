const db = require('../../config/db');

module.exports = {
  savingRecipeFiles(fileID, recipeID) {
    try {
      const query = `
              INSERT INTO recipe_files (
                recipe_id,
                file_id
              ) VALUES ($1, $2)`;

      return db.query(query, [recipeID, fileID]);
    } catch (error) {
      console.error(error);
    }
  },

  showAllRecipesFiles(recipeID) {
    try {
      const query = `
              SELECT * FROM recipe_files
              WHERE recipe_id=$1
              `;

      return db.query(query, [recipeID]);
    } catch (error) {
      console.error(error);
    }
  },
};
