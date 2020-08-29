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

let newIngredient = document.querySelector(".add-ingredient");

if (newIngredient) {
  newIngredient.addEventListener("click", addIngredient);
}

let newStep = document.querySelector(".add-step");

if (newStep) {
  newStep.addEventListener("click", addStep);
}
