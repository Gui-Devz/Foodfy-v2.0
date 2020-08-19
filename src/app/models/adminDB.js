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
    console.log(values[3]);
    console.log(dataPost);
    db.query(query, values, function (err, results) {
      if (err) throw `Database Error! ${err}`;

      callback(results.rows[0].id);
    });
  },
};
