const db = require("../../config/db");
const { arrayDB, formatBrowser } = require("../../lib/utils");

module.exports = {
  savingRecipe(dataPost) {
    const query = `
            INSERT INTO recipes (
                chef_id,
                title,
                ingredients,
                preparation,
                information,
                created_at
            ) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
        `;

    const values = [
      dataPost.chef_id || 2,
      dataPost.title,
      arrayDB(dataPost.ingredients),
      arrayDB(dataPost.preparation),
      dataPost.information,
      formatBrowser(Date.now()).iso,
    ];

    return db.query(query, values);
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
    const query = `DELETE FROM recipes WHERE id = $1`;

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

  createChef(dataPost, callback) {
    const query = `
        INSERT INTO chefs (
        name,
        avatar_url,
        created_at
        ) VALUES ($1, $2, $3)
        RETURNING id
      `;

    let values = [
      dataPost.name,
      dataPost.avatar_url,
      formatBrowser(Date.now()).iso,
    ];

    db.query(query, values, function (err, result) {
      if (err) throw `Database error! ${err}`;

      console.log(result.rows[0]);
      callback(result.rows[0].id);
    });
  },

  updateChef(dataPut, callback) {
    const query = `
        UPDATE chefs SET
            name = $1,
            avatar_url = $2
        WHERE id = $3
        RETURNING id`;

    let values = [dataPut.name, dataPut.avatar_url, dataPut.id];

    db.query(query, values, function (err, result) {
      if (err) throw `Database error! ${err}`;

      callback(result.rows[0].id);
    });
  },

  deleteChef(id, callback) {
    const query = `DELETE FROM chefs WHERE id = $1`;

    db.query(query, [id], function (err) {
      if (err) throw `Database error! ${err}`;

      callback();
    });
  },

  savingFile(filename, file) {
    const query = `
            INSERT INTO files (
                name,
                path
            ) VALUES ($1, $2)
            RETURNING id
        `;

    return db.query(query, [filename, file]);
  },

  deleteFile(fileID) {
    const query = `DELETE FROM files WHERE id = $1`;

    return (db.query = (query, [fileID]));
  },
};
