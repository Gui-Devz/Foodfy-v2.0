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
                information
            ) VALUES ($1, $2, $3, $4, $5)
            RETURNING id
        `;

    const values = [
      dataPost.chef_id,
      dataPost.title,
      arrayDB(dataPost.ingredients),
      arrayDB(dataPost.preparation),
      dataPost.information,
    ];

    return db.query(query, values);
  },

  chefsIdAndNames() {
    const query = `
        SELECT id, name FROM chefs
    `;

    return db.query(query);
  },
  deleteRecipe(recipeID) {
    const query = `DELETE FROM recipes WHERE id = $1`;

    return db.query(query, [recipeID]);
  },

  deleteRecipeFromRecipeFiles(recipeID) {
    const query = `DELETE FROM recipe_files WHERE recipe_files.recipe_id = $1`;

    return db.query(query, [recipeID]);
  },

  updateRecipe(dataPut) {
    const query = `
        UPDATE recipes SET
        chef_id = $1,
        title = $2,
        ingredients = $3,
        preparation = $4,
        information = $5
      WHERE id=$6
      RETURNING id`;

    let values = [
      dataPut.chef_id,
      dataPut.title,
      arrayDB(dataPut.ingredients),
      arrayDB(dataPut.preparation),
      dataPut.information,
      dataPut.id,
    ];

    return db.query(query, values);
  },

  createChef(name, fileID) {
    const query = `
        INSERT INTO chefs (
        name,
        file_id
        ) VALUES ($1, $2)
        RETURNING id
      `;

    return db.query(query, [name, fileID]);
  },

  updateChef(id, name) {
    const query = `
        UPDATE chefs SET
          name = $1
        WHERE id = $2
        RETURNING id;`;

    let values = [name, id];

    return db.query(query, values);
  },

  deleteChef(id) {
    const query = `DELETE FROM chefs WHERE id = $1`;

    return db.query(query, [id]);
  },

  savingFile(filename, filePath) {
    const query = `
            INSERT INTO files (
                name,
                path
            ) VALUES ($1, $2)
            RETURNING id
        `;

    return db.query(query, [filename, filePath]);
  },

  updateFile(id, name, filePath) {
    const query = `
        UPDATE files SET
          name = $1,
          path = $2
        WHERE id = $3
        RETURNING id`;

    let values = [name, filePath, id];

    return db.query(query, values);
  },

  savingRecipeFiles(FileID, RecipeID) {
    const query = `
            INSERT INTO recipe_files (
              recipe_id,
              file_id
            ) VALUES ($1, $2)`;

    return db.query(query, [RecipeID, FileID]);
  },

  deleteFilesFromRecipeFiles(fileID) {
    const query = `
      DELETE FROM recipe_files WHERE recipe_files.file_id = $1
    `;
    return db.query(query, [fileID]);
  },

  deleteFile(fileID) {
    const query = `DELETE FROM files WHERE id = $1`;

    return db.query(query, [fileID]);
  },
};
