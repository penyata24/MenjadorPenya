const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbwnpvz1oPMxSxLYOq-8LpWnhuGwkQxHWeFz_iUoLXz8Abdb30EhL4C5EozH4q0-kQdP/exec";

let sending = false;

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
sliderValue.textContent = scoreSlider.value;


// Cambiar puntuación
scoreSlider.addEventListener("input", function () {
    sliderValue.textContent = scoreSlider.value;
    checkForm();
});


// Cambiar comida
meal.addEventListener("change", checkForm);


function checkForm() {
    submit.disabled = !meal.value;
}


if (sending || !meal.value) return;

sending = true;
submit.disabled = true;
submit.textContent = "Enviant...";


// Enviar valoración
submit.addEventListener("click", function () {

    submit.disabled = true;
    submit.textContent = "Enviant...";

    const data = new URLSearchParams();
    data.append("meal", meal.value);
    data.append("score", scoreSlider.value);
    data.append("comment", comment.value.trim());
    data.append("userId", userId);
});


    fetch(SCRIPT_URL, {
        method: "POST",
        body: data
    })

    .then(function (response) {
    if (!response.ok) {
        throw new Error("Error del servidor");
    }

    return response.text();
})
.then(function (result) {
    result = result.trim();

    // Aquí mantienes tus comprobaciones de OK y BLOCKED
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

        sending = false;

        console.error("Error:", error);

        submit.disabled = false;
        submit.textContent = "Enviar valoració";

        alert(
            "No s'ha pogut enviar la valoració. Torna-ho a provar."
        );
    });
});