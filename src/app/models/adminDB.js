const db = require("../../config/db");
const { arrayDB, formatBrowser } = require("../../lib/utils");

module.exports = {
  saving(dataPost, callback) {
    const query = `
            INSERT INTO recipes (
                chef_id,
                image,
                title,
                ingredients,
                preparation,
                information,
                created_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id
        `;

    const values = [
      dataPost.chef_id,
      dataPost.image,
      dataPost.title,
      arrayDB(dataPost.ingredients),
      arrayDB(dataPost.preparation),
      dataPost.information,
      formatBrowser(Date.now()).iso,
    ];

    db.query(query, values, function (err, results) {
      if (err) throw `Database Error! ${err}`;

      callback(results.rows[0].id);
    });
  },

  //Function that gives all the chef's id and names of the database

  chefsIdAndNames(callback) {
    const query = `
        SELECT id, name FROM chefs
    `;

    db.query(query, function (err, results) {
      if (err) throw `Database error! ${err}`;

      callback(results.rows);
    });
  },

  showRecipe(id, callback) {
    const query = `
        SELECT * FROM recipes
        WHERE recipes.id = $1
      `;

    db.query(query, [id], function (err, results) {
      if (err) throw `Database error! ${err}`;

      callback(results.rows[0]);
    });
  },

  deleteRecipe(id, callback) {},

  updateRecipe(id, callback) {},
};
