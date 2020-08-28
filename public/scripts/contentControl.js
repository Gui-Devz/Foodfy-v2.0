const divSteps = document.querySelectorAll(".step");

let urlCheck = window.location.href;

function activateMenuLinksCSS(arrayObj, filter, content) {
  if (arrayObj.includes(`${filter}`)) {
    const menuLinks = document.querySelectorAll(".menu div ul li");

    for (const link of menuLinks) {
      if (link.firstChild.innerHTML == `${content}`) {
        link.firstChild.classList.toggle("activated");
      }
    }
  }
}

/* RECIPE DETAILS PAGE
-- This code allows to hide or show details about the recipe like the ingredients and the steps */
if (divSteps) {
  for (const divStep of divSteps) {
    const button = divStep.querySelector(".info-content p");

    button.addEventListener("click", () => {
      const content = divStep.querySelector("div");

      if (content.classList.contains("hidden")) {
        content.classList.remove("hidden");

        button.innerHTML = "Esconder";
      } else {
        content.classList.add("hidden");

        button.innerHTML = "Mostrar";
      }
    });
  }
}

/* CODE THAT DEFINES WHAT PAGES SHOULD SHOW THE OPTION FOR THE FILTER OF RECIPES */
if (urlCheck.includes("index") || urlCheck.includes("recipes")) {
  const filterDiv = document.querySelector(".filter");

  filterDiv.classList.toggle("show");
}

activateMenuLinksCSS(urlCheck, "recipes", "Receitas");
activateMenuLinksCSS(urlCheck, "about", "Sobre");
activateMenuLinksCSS(urlCheck, "chefs", "Chefs");
