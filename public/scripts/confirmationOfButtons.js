const buttonDelete = document.querySelector(".button-delete");
const buttonSave = document.querySelector(".button");
const divDelete = document.querySelector(".delete");
let urlPage = window.location.href;

if (buttonDelete) {
  //THIS CODE VERIFIES IF THE CHEF HAS ANY RECIPES REGISTERED BEFORE ALLOWING
  //TO EXCLUDE HIS PROFILE
  if (urlPage.includes("chefs")) {
    if (divDelete.dataset.has_recipes == "false") {
      buttonDelete.addEventListener("click", (event) => {
        const confirmation = confirm("Deseja excluir esse chef?!");

        if (!confirmation) return event.preventDefault();
      });
    } else if (divDelete.dataset.has_recipes == "true") {
      buttonDelete.addEventListener("click", (event) => {
        alert("Não é permitido excluir chefs que tenham receitas cadastradas!");

        return event.preventDefault();
      });
    }

    buttonSave.addEventListener("click", (event) => {
      const confirmation = confirm("Deseja salvar esse chef?!");

      if (!confirmation) return event.preventDefault();
    });
  } else if (urlPage.includes("recipes")) {
    buttonDelete.addEventListener("click", (event) => {
      const confirmation = confirm("Deseja excluir essa receita?!");

      if (!confirmation) return event.preventDefault();
    });
    buttonSave.addEventListener("click", (event) => {
      const confirmation = confirm("Deseja salvar essa receita?!");

      if (!confirmation) return event.preventDefault();
    });
  }
}
