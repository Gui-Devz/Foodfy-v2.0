const buttonDelete = document.querySelector(".button-delete");
const buttonSave = document.querySelector(".button");

if (buttonDelete) {
  buttonDelete.addEventListener("click", (event) => {
    const confirmation = confirm("Deseja excluir essa receita?!");

    if (!confirmation) return event.preventDefault();
  });
}

buttonSave.addEventListener("click", (event) => {
  const confirmation = confirm("Deseja salvar essa receita?!");

  if (!confirmation) return event.preventDefault();
});
