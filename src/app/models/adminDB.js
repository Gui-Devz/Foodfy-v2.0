const db = require("../../config/db");
const { arrayDB, formatBrowser } = require("../../lib/utils");

module.exports = {
  savingRecipe(dataPost, callback) {
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
  deleteRecipe(id, callback) {
    const query = `DELETE FROM recipes WHERE = $1`;

    db.query(query, [id], function (err) {
      if (err) throw `Database error! ${err}`;

      callback();
    });
  },

  updateRecipe(dataPut, callback) {
    const query = `
        UPDATE recipes SET
        chef_id = $1,
        image = $2,
        title = $3,
        ingredients = $4,
        preparation = $5,
        information = $6
      WHERE id=$7
      RETURNING id`;

    let values = [
      dataPut.chef_id,
      dataPut.image,
      dataPut.title,
      arrayDB(dataPut.ingredients),
      arrayDB(dataPut.preparation),
      dataPut.information,
      dataPut.id,
    ];

    db.query(query, values, function (err, result) {
      if (err) throw `Database error! ${err}`;

      callback(result.rows[0].id);
    });
  },
};
