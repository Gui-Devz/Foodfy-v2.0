const db = require("../../config/db");

module.exports = {
  showRecipe(id) {
    const query = `
        SELECT recipes.*, recipes.chef_id AS chef_id, chefs.name AS chef
        FROM recipes LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE recipes.id = $1
      `;

    return db.query(query, [id]);
  },

  showRecipesWithImages(filter) {
    let query = "";
    let filterQuery = "";
    let orderQuery = `ORDER BY recipes.created_at DESC`;

    if (filter) {
      filterQuery = `WHERE recipes.title ILIKE '%${filter}%'
                      OR recipes.information ILIKE '%${filter}%'`;

      orderQuery = `ORDER BY recipes.updated_at DESC`;
    }

    query = `SELECT recipes.*, files.name AS file_name,
              files.path AS file_path, chefs.name AS chef
            FROM recipe_files LEFT JOIN recipes ON (recipe_files.recipe_id = recipes.id)
            INNER JOIN files ON (recipe_files.file_id = files.id)
            INNER JOIN chefs ON (recipes.chef_id = chefs.id)
            ${filterQuery}
            ${orderQuery}
            `;

    return db.query(query);
  },

  showUserRecipes(userID) {
    const query = `
     SELECT recipes.*, files.name AS file_name,
              files.path AS file_path, chefs.name AS chef
            FROM recipe_files LEFT JOIN recipes ON (recipe_files.recipe_id = recipes.id)
            INNER JOIN files ON (recipe_files.file_id = files.id)
            INNER JOIN chefs ON (recipes.chef_id = chefs.id)
            WHERE recipes.user_id = $1
    `;

    return db.query(query, [userID]);
  },

  saving(dataPost, userID) {
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
  },
  update(dataPut) {
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
      dataPut.user_id || 1,
      dataPut.title,
      arrayDB(dataPut.ingredients),
      arrayDB(dataPut.preparation),
      dataPut.information,
      dataPut.id,
    ];

    return db.query(query, values);
  },

  delete(recipeID) {
    const query = `DELETE FROM recipes WHERE id = $1`;

    return db.query(query, [recipeID]);
  },
};
