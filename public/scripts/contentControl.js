const divSteps = document.querySelectorAll(".step");

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
