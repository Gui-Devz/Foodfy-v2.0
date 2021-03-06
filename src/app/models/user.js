const db = require("../../config/db");

module.exports = {
  async find(filters) {
    try {
      let query = "SELECT * FROM users";

      if (filters) {
        Object.keys(filters).map((key) => {
          //WHERE | OR | AND
          query = `
            ${query}
            ${key}
          `;

          Object.keys(filters[key]).map((field) => {
            query = `${query} ${field} = '${filters[key][field]}'`;
          });
        });
      }
      const result = await db.query(query);

      //console.log(result.rows);
      return result.rows;
    } catch (error) {
      console.error(error);
    }
  },

  async saving(dataPost) {
    const query = `
        INSERT INTO users (
          name,
          email,
          password,
          is_admin
        ) VALUES ($1, $2, $3, $4)
        RETURNING id
      `;

    const passwordHash = await hash(dataPost.password);

    const values = [
      dataPost.name,
      dataPost.email,
      passwordHash,
      dataPost.isAdmin,
    ];

    return db.query(query, values);
  },
};
