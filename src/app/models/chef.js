const db = require("../../config/db");

module.exports = {
  showChefs() {
    const query = `
        SELECT chefs.*, (SELECT count(*) FROM recipes WHERE chefs.id=recipes.chef_id) AS qt_recipes,
          files.path AS file_path, files.name AS file_name
        FROM chefs LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
        INNER JOIN files ON (chefs.file_id = files.id)
        GROUP BY chefs.id, files.path, files.name
    `;

    return db.query(query);
  },

  showChef(id) {
    const query = `
        SELECT DISTINCT ON (chefs.id)chefs.*, (SELECT count(*) FROM recipes WHERE chefs.id=recipes.chef_id) AS qt_recipes,
          files.path AS file_path, files.name AS file_name
        FROM chefs LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
        INNER JOIN files ON (chefs.file_id = files.id)
        WHERE chefs.id = $1
        GROUP BY chefs.id, files.path, files.name
      `;

    return db.query(query, [id]);
  },

  showChefsRecipes(id) {
    const query = `
        SELECT DISTINCT ON (recipes.id)recipes.*, chefs.name AS chef,
          files.path AS file_path, files.name AS file_name
        FROM recipe_files LEFT JOIN recipes ON (recipe_files.recipe_id = recipes.id)
        INNER JOIN files ON (recipe_files.file_id = files.id)
        INNER JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE recipes.chef_id = $1
      `;

    return db.query(query, [id]);
  },
};
