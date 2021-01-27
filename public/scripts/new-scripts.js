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

const filteringFunction = {
  commonFiltering(keyWords, functionCalled) {
    const url = window.location.href;

    for (const keyWord of keyWords) {
      if (url.includes(keyWord)) {
        functionCalled();
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

const controlContentRecipe = {
  showOrHide(e) {
    const button = e.target;
    const divStep = button.parentElement.parentElement.childNodes[3];

    console.log(divStep);

    if (divStep.classList.contains("hidden")) {
      divStep.classList.remove("hidden");

      button.innerHTML = "Esconder";
    } else {
      divStep.classList.add("hidden");

      button.innerHTML = "Mostrar";
    }
  },
};

const showingSearchBar = {
  showing() {
    const url = window.location.href;
    if (
      url.includes("index") ||
      (url.includes("recipes") &&
        !url.includes("recipes/") &&
        !url.includes("admin") &&
        !url.includes("edit"))
    ) {
      const filterDiv = document.querySelector(".filter");

      filterDiv.classList.add("show");
    }
  },
};

const menuLinksActivation = {
  activated(filter, content) {
    const url = window.location.href;
    if (url.includes(`${filter}`)) {
      const menuLinks = document.querySelectorAll(".menu div ul li");

      for (const link of menuLinks) {
        if (link.firstChild.innerHTML == `${content}`) {
          link.firstChild.classList.toggle("activated");
        }
      }
    }
  },
};

const uploadingImages = {
  previewImages: document.querySelector(".preview-images"),
  uploadLimit: 5,
  files: [],
  input: "",

  handleFilesInput(event) {
    uploadingImages.input = event.target;
    const { files: fileList } = event.target;
    const { loadImageDiv } = uploadingImages;

    if (uploadingImages.hasLimit(event)) return;

    loadImageDiv(fileList);

    event.target.files = uploadingImages.getAllFiles();
  },
  loadImageDiv(list) {
    const { createContainerForImage } = uploadingImages;

    Array.from(list).forEach((file) => {
      uploadingImages.files.push(file);

      const reader = new FileReader();

      reader.onload = () => {
        createContainerForImage(reader.result);
      };
      reader.readAsDataURL(file);
    });
  },

  getAllFiles() {
    const dataTransfer =
      new ClipboardEvent("").clipboardData || new DataTransfer();

    uploadingImages.files.forEach((file) => dataTransfer.items.add(file));

    return dataTransfer.files;
  },

  hasLimit(event) {
    const { files, uploadLimit, input } = uploadingImages;

    const totalFiles = files.length + input.files.length;

    if (totalFiles > uploadLimit) {
      alert(`Adicione no máximo ${uploadLimit} imagens!`);
      event.preventDefault();
      return true;
    }

    return false;
  },

  getContainer(img) {
    const container = document.createElement("div");

    container.appendChild(img);

    container.appendChild(uploadingImages.getCloseButton());

    return container;
  },

  getCloseButton() {
    const icon = document.createElement("i");

    icon.classList.add("material-icons");

    icon.innerHTML = "close";

    icon.onclick = uploadingImages.removeImage;

    return icon;
  },

  createContainerForImage(readerResult) {
    const { previewImages, getContainer } = uploadingImages;

    const image = new Image();
    image.src = String(readerResult);

    previewImages.appendChild(getContainer(image));
  },

  removeImage(event) {
    const imgContainer = event.target.parentNode;

    const allContainers = document.querySelectorAll(".preview-images div");

    const index = Array.from(allContainers).indexOf(imgContainer);

    uploadingImages.files.splice(index, 1);

    uploadingImages.input.files = uploadingImages.getAllFiles();

    uploadingImages.addRemovedPhotoIntoInput(event);

    imgContainer.remove();
  },

  addRemovedPhotoIntoInput(event) {
    const file_id = event.target.id; // getting the id from <i>
    let inputRemoved = document.querySelector(".removed-files");

    if (inputRemoved) inputRemoved.value += `${file_id},`;
  },
};

const activatingInputFiles = {
  activate() {
    const inputFile = document.querySelector(".avatar-image");

    inputFile.click();
  },
};

const uploadChefAvatar = {
  handleFile(event) {
    const inputValue = event.target.value;
    const inputUrl = document.querySelector(".file-name");
    const filteredName = Array.from(inputValue).slice(12).join("");

    inputUrl.value = filteredName;
  },
};

filteringFunction.commonFiltering(["filter"], addingFilterSearchH1.h1);
/* filteringFunction.commonFiltering(
  ["index", "filter"],
  addingLinksToCards.linking
); */

addingLinksToCards.linking();
showingSearchBar.showing();

menuLinksActivation.activated("recipes", "Receitas");
menuLinksActivation.activated("about", "Sobre");
menuLinksActivation.activated("chefs", "Chefs");
