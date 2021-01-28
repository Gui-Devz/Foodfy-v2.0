const db = require("../../config/db");

module.exports = {
  showRecipe(id) {
    const query = `
        SELECT recipes.*, chefs.name AS chef
        FROM recipes LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE recipes.id = $1
      `;

    return db.query(query, [id]);
  },

  showRecipesWithOnlyOneImage(limit) {
    let query = "";
    let limitQuery = "";

    if (limit)
      limitQuery = `ORDER BY recipes.id DESC
                      LIMIT 6`;

    query = `SELECT DISTINCT ON (recipes.id)recipes.*, files.name AS file_name,
              files.path AS file_path, chefs.name AS chef
            FROM recipe_files LEFT JOIN recipes ON (recipe_files.recipe_id = recipes.id)
            INNER JOIN files ON (recipe_files.file_id = files.id)
            INNER JOIN chefs ON (recipes.chef_id = chefs.id)
            ${limitQuery}`;

    return db.query(query);
  },

  filter(filter) {
    let query = "",
      filterQuery = "";

    if (filter) {
      filterQuery = `WHERE recipes.title ILIKE '%${filter}%'`;
    }

    query = `
        SELECT DISTINCT ON (recipes.id)recipes.*, files.name AS file_name, files.path AS file_path
            FROM recipe_files LEFT JOIN recipes ON (recipe_files.recipe_id = recipes.id)
            INNER JOIN files ON (recipe_files.file_id = files.id)
        ${filterQuery}
      `;
    return db.query(query);
  },
};
