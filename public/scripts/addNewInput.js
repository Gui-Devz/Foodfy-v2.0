function addIngredient() {
  const ingredients = document.querySelector(".ingredients");
  const ingredient = document.querySelectorAll(".ingredient");

  const newField = ingredient[ingredient.length - 1].cloneNode(true);

  // Não adiciona um novo input se o último tem um valor vazio
  if (newField.children[0].value == "")
    return alert("Preencha campo vazio antes de adicionar novo!");

  newField.children[0].value = "";
  ingredients.appendChild(newField);
}

function addStep() {
  const steps = document.querySelector(".steps");
  const step = document.querySelectorAll(".step");

  const newField = step[step.length - 1].cloneNode(true);

  if (newField.children[0].value == "")
    return alert("Preencha campo vazio antes de adicionar novo!");

  newField.children[0].value = "";
  steps.appendChild(newField);
}

document
  .querySelector(".add-ingredient")
  .addEventListener("click", addIngredient);

document.querySelector(".add-step").addEventListener("click", addStep);
