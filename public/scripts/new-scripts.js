const addingLinksToCards = {
  cards: document.querySelectorAll(".card"),
  linking() {
    for (const card of addingLinksToCards.cards) {
      card.addEventListener("click", () => {
        const id = card.getAttribute("id");

        window.location.href = `/recipes/${id}`;
      });
    }
  },
};

const addingFilterSearchH1 = {
  h1() {
    let filter = document.querySelector("#filter").dataset.filter;
    if (filter != "") {
      const element = document.createElement("h1");
      const wrapperGrid = document.querySelector(".wrapper-grid");

      element.innerHTML = `Buscando por "${filter}"`;
      wrapperGrid.insertBefore(element, wrapperGrid.firstChild);
    }
  },
};

const filteringFunctions = {
  commonFiltering(keyWords, functionsCalled) {
    const url = window.location.href;

    for (const keyWord of keyWords) {
      if (url.includes(keyWord)) {
        for (const exec of functionsCalled) {
          exec();
        }
      }
    }
  },
};

const controllingFieldsInput = {
  addIngredient() {
    const ingredients = document.querySelector(".ingredients");
    const ingredient = document.querySelectorAll(".ingredient");

    const newField = ingredient[ingredient.length - 1].cloneNode(true);

    // Não adiciona um novo input se o último tem um valor vazio
    if (newField.children[0].value == "")
      return alert("Preencha campo vazio antes de adicionar novo!");

    newField.children[0].value = "";
    ingredients.appendChild(newField);
  },

  addStep() {
    const steps = document.querySelector(".steps");
    const step = document.querySelectorAll(".step");

    const newField = step[step.length - 1].cloneNode(true);

    if (newField.children[0].value == "")
      return alert("Preencha campo vazio antes de adicionar novo!");

    newField.children[0].value = "";
    steps.appendChild(newField);
  },
};

const confirmationOfButtons = {
  verifyingBeforeDeleteChef(e) {
    const divDelete = document.querySelector(".delete");

    if (divDelete.dataset.has_recipes == "false") {
      const confirmation = confirm("Deseja excluir esse chef?!");

      if (!confirmation) return e.preventDefault();
    } else if (divDelete.dataset.has_recipes == "true") {
      alert("Não é permitido excluir chefs que tenham receitas cadastradas!");

      return e.preventDefault();
    }
  },

  verifyingBeforeSavingChef(e) {
    const confirmation = confirm("Deseja salvar esse chef?!");

    if (!confirmation) return e.preventDefault();
  },
  verifyingBeforeDeleteRecipe(e) {
    const confirmation = confirm("Deseja excluir essa receita?!");

    if (!confirmation) return e.preventDefault();
  },

  verifyingBeforeSavingRecipe(e) {
    const confirmation = confirm("Deseja salvar essa receita?!");

    if (!confirmation) return e.preventDefault();
  },
};

filteringFunctions.commonFiltering(["filter"], [addingFilterSearchH1.h1]);

addingLinksToCards.linking();
