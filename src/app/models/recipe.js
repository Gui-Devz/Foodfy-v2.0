const db = require("../../config/db");

module.exports = {
  showRecipe(id, callback) {
    const query = `
        SELECT recipes.*, chefs.name AS chef
        FROM recipes LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE recipes.id = $1
      `;

    db.query(query, [id], function (err, results) {
      if (err) throw `Database error! ${err}`;

      callback(results.rows[0]);
    });
  },

  showRecipes(callback) {
    const query = `
        SELECT recipes.*, chefs.name AS chef
        FROM recipes LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      `;

    db.query(query, function (err, results) {
      if (err) throw `Database error! ${err}`;

      callback(results.rows);
    });
  },

  filter(filter, callback) {
    let query = "",
      filterQuery = "";

    if (filter) {
      filterQuery = `WHERE recipes.title ILIKE '%${filter}%'`;
    }

    query = `
        SELECT recipes.*, chefs.name AS chef
        FROM recipes LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        ${filterQuery}
      `;
    db.query(query, function (err, results) {
      if (err) throw `Database error! ${err}`;

      callback(results.rows);
    });
  },
};
