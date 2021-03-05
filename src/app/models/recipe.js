const db = require("../../config/db");
const { arrayDB } = require("../../lib/utils");

module.exports = {
  async find(filters) {
    try {
      let query = `
          SELECT recipes.*, files.name AS file_name,
              files.path AS file_path, chefs.name AS chef
          FROM recipe_files LEFT JOIN recipes ON (recipe_files.recipe_id = recipes.id)
          INNER JOIN files ON (recipe_files.file_id = files.id)
          INNER JOIN chefs ON (recipes.chef_id = chefs.id)`;

      if (filters) {
        // console.log(Object.values(filters));
        Object.keys(filters).map((key) => {
          //WHERE | OR | AND
          query = `
            ${query}
            ${key}
          `;

          Object.keys(filters[key]).map((field) => {
            // console.log(field);
            query = `${query} ${field} = '${filters[key][field]}'`;
          });
        });
      }

      // console.log(query);
      const result = await db.query(query);

      return result.rows;
    } catch (error) {
      console.error(error);
    }
  },

  async searchFilter(filters) {
    try {
      let query = `
          SELECT recipes.*, files.name AS file_name,
              files.path AS file_path, chefs.name AS chef
          FROM recipe_files LEFT JOIN recipes ON (recipe_files.recipe_id = recipes.id)
          INNER JOIN files ON (recipe_files.file_id = files.id)
          INNER JOIN chefs ON (recipes.chef_id = chefs.id)`;

      Object.keys(filters).map((key) => {
        //WHERE | OR | AND
        query = `
            ${query}
            ${key}
          `;

        Object.keys(filters[key]).map((field) => {
          query = `${query} ${field} ILIKE '${filters[key][field]}'`;
        });
      });

      query = `
          ${query}
          ORDER BY recipes.created_at DESC
        `;

      const result = await db.query(query);

      return result.rows;
    } catch (error) {
      console.error(error);
    }
  },

  saving(dataPost, userID) {
    try {
      const query = `
              INSERT INTO recipes (
                  chef_id,
                  user_id,
                  title,
                  ingredients,
                  preparation,
                  information
              ) VALUES ($1, $2, $3, $4, $5, $6)
              RETURNING id
          `;

      const values = [
        dataPost.chef_id,
        userID,
        dataPost.title,
        arrayDB(dataPost.ingredients),
        arrayDB(dataPost.preparation),
        dataPost.information,
      ];

      return db.query(query, values);
    } catch (error) {
      console.error(error);
    }
  },
  update(dataPut, userID) {
    try {
      const query = `
          UPDATE recipes SET
          chef_id = $1,
          user_id = $2,
          title = $3,
          ingredients = $4,
          preparation = $5,
          information = $6
        WHERE id=$7
        RETURNING id`;

      let values = [
        dataPut.chef_id,
        userID,
        dataPut.title,
        arrayDB(dataPut.ingredients),
        arrayDB(dataPut.preparation),
        dataPut.information,
        dataPut.id,
      ];

      return db.query(query, values);
    } catch (error) {
      console.error(error);
    }
  },
  delete(recipeID) {
    try {
      const query = `DELETE FROM recipes WHERE id = $1`;

      return db.query(query, [recipeID]);
    } catch (error) {
      console.error(error);
    }
  },
};
