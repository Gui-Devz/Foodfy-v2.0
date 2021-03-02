const db = require("../../config/db");
const { hash } = require("bcryptjs");
const { arrayDB } = require("../../lib/utils");

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

  deleteFromRecipeFiles(fileID, recipeID) {
    try {
      let query = "DELETE FROM recipe_files";

      Object.keys(filters).map((key) => {
        //WHERE | OR | AND
        query = `
          ${query}
          ${key}
        `;

        Object.keys(filters[key]).map((field) => {
          query = `${query} ${field} = '${filters[key][field]}'`;
        });
      });
      return db.query(query);
    } catch (error) {
      console.error(error);
    }
  },
};
