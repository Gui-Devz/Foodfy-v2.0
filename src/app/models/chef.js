const db = require("../../config/db");

module.exports = {
  showChefs(callback) {
    const query = `
        SELECT chefs.*, (SELECT count(*) FROM recipes WHERE chefs.id=recipes.chef_id) AS qt_recipes
        FROM chefs LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
        GROUP BY chefs.id
    `;

    db.query(query, function (err, results) {
      if (err) throw `Database error! ${err}`;

      callback(results.rows);
    });
  },

  showChef(id, callback) {
    const query = `
        SELECT chefs.*, (SELECT count(*) FROM recipes WHERE chefs.id=recipes.chef_id) AS qt_recipes
        FROM chefs LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
        WHERE chefs.id = $1
        GROUP BY chefs.id
      `;

    db.query(query, [id], function (err, result) {
      if (err) throw `Database error! ${err}`;

      callback(result.rows[0]);
    });
  },

  showChefsRecipes(id, callback) {
    const query = `
        SELECT recipes.*, chefs.name AS chef
        FROM recipes LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE chefs.id = $1
      `;

    db.query(query, [id], function (err, results) {
      if (err) throw `Database error! ${err}`;

      callback(results.rows);
    });
  },
};
