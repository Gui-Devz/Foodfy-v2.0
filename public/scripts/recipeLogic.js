const cards = document.querySelectorAll(".card");

for (const card of cards) {
  card.addEventListener("click", () => {
    const id = card.getAttribute("id");
    window.location.href = `/recipes/${id}`;
  });
}
