const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbwnpvz1oPMxSxLYOq-8LpWnhuGwkQxHWeFz_iUoLXz8Abdb30EhL4C5EozH4q0-kQdP/exec";

let selectedScore = "5";

const scoreSlider =
    document.getElementById("scoreSlider");

const sliderValue =
    document.getElementById("sliderValue");

const meal =
    document.getElementById("meal");

const submit =
    document.getElementById("submit");

const comment =
    document.getElementById("comment");


// Crear un identificador anónimo para este navegador
let userId = localStorage.getItem("valoracioUserId");

if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem("valoracioUserId", userId);
}


// Mostrar puntuación inicial
sliderValue.textContent = selectedScore;


// Cambiar puntuación
scoreSlider.addEventListener("input", function () {
    selectedScore = scoreSlider.value;
    sliderValue.textContent = selectedScore;
    checkForm();
});


// Cambiar comida
meal.addEventListener("change", checkForm);


function checkForm() {

    if (
        meal.value !== "" &&
        selectedScore !== null
    ) {
        submit.disabled = false;
    } else {
        submit.disabled = true;
    }
}


// Enviar valoración
submit.addEventListener("click", function () {

    submit.disabled = true;
    submit.textContent = "Enviant...";

    const data = new URLSearchParams();

    data.append("meal", meal.value);
    data.append("score", selectedScore);
    data.append("comment", comment.value);
    data.append("userId", userId);


    fetch(SCRIPT_URL, {
        method: "POST",
        body: data
    })

    .then(function (response) {
        return response.text();
    })

    .then(function (result) {

        // Ha votado dentro de las últimas 4 horas
        if (result === "BLOCKED") {

            document.querySelector(".container").innerHTML = `
                <h1>⏱️ Ja has votat</h1>

                <p>
                    Ja has enviat una valoració
                    durant les últimes 4 hores.
                </p>

                <p>
                    Podràs tornar a valorar més endavant.
                </p>
            `;

            return;
        }


        // Voto registrado correctamente
        if (result === "OK") {

            document.querySelector(".container").innerHTML = `
                <h1>✓ Gràcies!</h1>

                <p>
                    La teva valoració s'ha registrat.
                </p>

                <p>
                    Gràcies per participar.
                </p>
            `;

            return;
        }


        // Error
        throw new Error("Respuesta inesperada");
    })

    .catch(function (error) {

        console.error("Error:", error);

        submit.disabled = false;
        submit.textContent = "Enviar valoració";

        alert(
            "No s'ha pogut enviar la valoració. Torna-ho a provar."
        );
    });
});
