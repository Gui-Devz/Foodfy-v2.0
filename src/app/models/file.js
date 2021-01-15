const db = require("../../config/db");

module.exports = {
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
};
