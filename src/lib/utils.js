module.exports = {
  age(timestamp) {
    const today = new Date();
    const birthDate = new Date(timestamp);

    //2020 - 1997 = 23
    let age = today.getUTCFullYear() - birthDate.getFullYear();
    const month = today.getUTCMonth() - birthDate.getMonth();

    if (month < 0 || (month == 0 && today.getUTCDate() < birthDate.getDate())) {
      age = age - 1;
    }

    return age;
  },

  formatBrowser(timestamp) {
    const date = new Date(timestamp);
    const day = `0${date.getUTCDate()}`.slice(-2);
    const month = `0${date.getUTCMonth() + 1}`.slice(-2);
    const year = `${date.getUTCFullYear()}`;

    return {
      day: day,
      month: month,
      year: year,
      iso: `${year}-${month}-${day}`,
      birthday: `${day}/${month}`,
      format: `${day}/${month}/${year}`,
    };
  },

  //Function guarantees that the arrays are set for the database
  arrayDB(array) {
    let newArray = [];

    for (let i of array) {
      i = `"${i}"`;
      newArray.push(i);
    }

    return `{${newArray}}`;
  },

  /* Function guarantees that inputs that are arrays don't have blank content
  inside it like ""
  */
  validationOfInputs(inputs) {
    let newInputs = [];
    for (let i = 0; i < inputs.length; i++) {
      const inputClone = inputs[i].trim();

      if (inputClone != "") {
        newInputs.push(inputs[i]);
      }
    }

    return newInputs;
  },

  validationOfBlankForms(fields) {
    const keys = Object.keys(fields);

    for (const key of keys) {
      if (fields[key] == "" && key != "removed_photos") {
        return true;
      }
      return false;
    }
  },
  formatPath(files, req) {
    let photos = files.map((file) => ({
      ...file,
      file_path: `${req.protocol}://${req.headers.host}${file.file_path.replace(
        "public",
        ""
      )}`,
    }));

    return photos;
  },

  //Assigning each file to the related recipe
  assignFilesToRecipes(recipes, files) {
    let recipesWithFiles = [];
    recipes.forEach((recipe) => {
      let recipeImages = [];
      files.forEach((file) => {
        if (recipe.id === file.recipe_id) {
          recipeImages.push({
            fileName: file.file_name,
            filePath: file.file_path,
          });
        }
      });
      const recipeWithFiles = {
        ...recipe,
        files: recipeImages,
      };

      recipesWithFiles.push(recipeWithFiles);
    });
    return recipesWithFiles;
  },
};
