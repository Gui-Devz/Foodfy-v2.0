const db = require("../../config/db");

module.exports = {
  showRecipe(id) {
    const query = `
        SELECT recipes.*, recipes.chef_id AS chef_id, chefs.name AS chef
        FROM recipes LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE recipes.id = $1
      `;

    return db.query(query, [id]);
  },

  showRecipesWithImages(filter) {
    let query = "";
    let filterQuery = "";
    let orderQuery = `ORDER BY recipes.created_at DESC`;

    if (filter) {
      filterQuery = `WHERE recipes.title ILIKE '%${filter}%'
                      OR recipes.information ILIKE '%${filter}%'`;

      orderQuery = `ORDER BY recipes.updated_at DESC`;
    }

    query = `SELECT recipes.*, files.name AS file_name,
              files.path AS file_path, chefs.name AS chef
            FROM recipe_files LEFT JOIN recipes ON (recipe_files.recipe_id = recipes.id)
            INNER JOIN files ON (recipe_files.file_id = files.id)
            INNER JOIN chefs ON (recipes.chef_id = chefs.id)
            ${filterQuery}
            ${orderQuery}
            `;

    return db.query(query);
  },

  showUserRecipes(userID) {
    const query = `
     SELECT recipes.*, files.name AS file_name,
              files.path AS file_path, chefs.name AS chef
            FROM recipe_files LEFT JOIN recipes ON (recipe_files.recipe_id = recipes.id)
            INNER JOIN files ON (recipe_files.file_id = files.id)
            INNER JOIN chefs ON (recipes.chef_id = chefs.id)
            WHERE recipes.user_id = $1
    `;

    return db.query(query, [userID]);
  },
};
