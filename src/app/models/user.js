const { hash } = require("bcryptjs");
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

  async saving(user) {
    const query = `
        INSERT INTO users (
          name,
          email,
          password,
          is_admin
        ) VALUES ($1, $2, $3, $4)
        RETURNING id
      `;

    const passwordHash = await hash(user.password, 8);
    //console.log(passwordHash);

    user.password = passwordHash;

    const values = Object.values(user);

    console.log(values);

    // return db.query(query, values);
  },
};
