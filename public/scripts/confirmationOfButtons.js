const buttonDelete = document.querySelector(".button-delete");
const buttonSave = document.querySelector(".button");
const divDelete = document.querySelector(".delete");
let urlPage = window.location.href;

if (buttonDelete) {
  if (urlPage.includes("chefs")) {
    if (divDelete.dataset.hasRecipes) {
      console.log("true");
    } else {
      console.log("false");
    }

    console.log(divDelete.dataset.has_recipes);
  }
  buttonDelete.addEventListener("click", (event) => {
    const confirmation = confirm("Deseja excluir essa receita?!");

    if (!confirmation) return event.preventDefault();
  });
}

buttonSave.addEventListener("click", (event) => {
  const confirmation = confirm("Deseja salvar essa receita?!");

  if (!confirmation) return event.preventDefault();
});
