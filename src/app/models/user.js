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
          is_admin,
          reset_token,
          reset_token_expires
        ) VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
      `;

    const passwordHash = await hash(user.password, 8);
    //console.log(passwordHash);

    user.password = passwordHash;
    user.email = String(user.email).toLowerCase();

    //console.log(user.email);

    const values = Object.values(user);

    //console.log(values);

    return db.query(query, values);
  },

  async updating(userID, filters) {
    let query = `UPDATE users SET`;

    Object.keys(filters).map((key, index) => {
      //fields
      query = `
            ${query}
              ${key} = $${index + 1},`;
    });

    //removing the last "," comma in the query.
    query = query.slice(0, -1);

    query = `
      ${query}
        WHERE users.id = $${Object.keys(filters).length + 1}
        RETURNING id
      `;

    if (filters.password) {
      //console.log(filters.password);
      const newPassword = await hash(filters.password, 8);

      filters.password = newPassword;
    }

    filters.email = String(filters.email).toLowerCase();
    //console.log(filters.email);

    let values = Object.values(filters);
    values.push(userID);

    // console.log(query);
    // console.log(values);

    const result = await db.query(query, values);

    //console.log(result.rows);
    return result.rows[0];
  },

  delete(userID) {
    try {
      const query = `DELETE FROM users WHERE id = $1`;

      return db.query(query, [userID]);
    } catch (error) {
      console.error(error);
    }
  },
};
