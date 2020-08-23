const db = require("../../config/db");

module.exports = {
  showChefs(callback) {
    const query = `
    SELECT * FROM chefs
    `;

    db.query(query, function (err, results) {
      if (err) throw `Database error! ${err}`;

      callback(results.rows);
    });
  },

  showChef(callback) {
    const query = `
        SELECT * FROM chefs
        WHERE chefs.id = 2
      `;

    db.query(query, [id], function (err, result) {
      if (err) throw `Database error! ${err}`;

      callback(result.rows[0]);
    });
  },
};
