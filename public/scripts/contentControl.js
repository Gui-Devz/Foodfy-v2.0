const divSteps = document.querySelectorAll(".step");

let menuOn = window.location.href;

function activateMenuLinksCSS(arrayObj, filter, content) {
  if (arrayObj.includes(`${filter}`)) {
    const menuLinks = document.querySelectorAll(".menu div ul li");

    console.log(menuLinks);

    for (const link of menuLinks) {
      if (link.firstChild.innerHTML == `${content}`) {
        link.firstChild.classList.toggle("activated");
      }
    }
  }
}

activateMenuLinksCSS(menuOn, "recipes", "Receitas");
activateMenuLinksCSS(menuOn, "about", "Sobre");
activateMenuLinksCSS(menuOn, "chefs", "Chefs");

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
