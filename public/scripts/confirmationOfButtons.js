const buttonDelete = document.querySelector(".button-delete");
const buttonSave = document.querySelector(".button");
let urlPage = window.location.href;

if (buttonDelete) {
  if (urlPage.includes("chefs")) {
    if (buttonDelete.dataset.recipes) {
      console.log("true");
    } else {
      console.log("false");
    }
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
