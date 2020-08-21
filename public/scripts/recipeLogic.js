const cards = document.querySelectorAll(".card");

let filter = document.querySelector(".filter").dataset.filter;

console.log(filter);

for (const card of cards) {
  card.addEventListener("click", () => {
    const id = card.getAttribute("id");
    window.location.href = `/recipes/${id}`;
  });
}

function addingH1() {
  const element = document.createElement("h1");
  const wrapperGrid = document.querySelector(".wrapper-grid");

  element.innerHTML = `Buscando por "${filter}"`;
  wrapperGrid.insertBefore(element, wrapperGrid.firstChild);
}

if (filter) {
  addingH1();
}
