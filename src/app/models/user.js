const db = require("../../config/db");

module.exports = {
  async findUser(filters) {
    try {
      let query = "SELECT * FROM users";

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
      const result = await db.query(query);

      return result.rows[0];
    } catch (error) {
      console.error(error);
    }
  },
};
