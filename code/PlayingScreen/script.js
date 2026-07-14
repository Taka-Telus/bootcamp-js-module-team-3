const baseUrl = "https://quiz-api.cesar-kastli.workers.dev";



// Obtener ID de la URL
const params = new URLSearchParams(window.location.search);
const gameId = params.get("id");

async function obtenerGame() {
    if (!gameId) {
        section.innerHTML = "<h2>No se encontró ningún juego.</h2>";
        return;
    }

    try {
        const response = await fetch(`${baseUrl}/games/${gameId}`);
        const game = await response.json();
        mostrarPregunta(game);
    } catch (error) {
        console.error(error);
        section.innerHTML = "<h2>Error al cargar el juego.</h2>";
    }
}

let preguntaActual = 0;
let tiempoTerminado = false;

// Inicializar localStorage para puntos
if (!localStorage.getItem("puntos")) {
    localStorage.setItem("puntos", 0);
}

const section = document.getElementById("section");

obtenerGame();  // Llama a la funcion para obtener el juego y mostrar la primera pregunta.

function finalizarQuiz(mensaje) {
    tiempoTerminado = true;
    clearInterval(intervaloTiempo);
    section.innerHTML = `<h2>${mensaje}</h2>`;
    window.location.href = '../Score/ScoreScreen.html'
}

function calcularYGuardarPuntos() {
    const puntosPregunta = (typeof numero === 'number' && numero > 0) ? numero * 4 : 0; // tiempo restante * 4
    const puntosActuales = parseInt(localStorage.getItem("puntos")) || 0;
    const puntosTotal = puntosActuales + puntosPregunta;
    localStorage.setItem("puntos", puntosTotal);
    console.log(`Puntos ganados: ${puntosPregunta}, Total: ${puntosTotal}`);
}

function mostrarPregunta(game) {
    if (tiempoTerminado) return;

    section.innerHTML = ""; // limpia el html de ''section'' por lo tanto, borra todo lo anterior.

    // Pregunta
    const question = document.createElement("p"); // crea la pregunta como un <p>
    question.textContent = game.questions[preguntaActual].text;
    section.appendChild(question);

    const respuesta = document.createElement("p");
    respuesta.style.display = "none";
    question.after(respuesta);
    respuesta.classList.add("mensaje-respuesta")

    // Opciones
    const opciones = document.createElement("ul"); // crea la <ul>
    section.appendChild(opciones);


    let respondida = false; // evita que se pueda responder mas de una vez.

    // Preparar opciones: crear objetos con marca de correcta y mezclar todas
    const opcionesOriginales = game.questions[preguntaActual].options;
    const opcionesObj = opcionesOriginales.map((texto, idx) => ({ texto, isCorrect: idx === 0 }));
    // Fisher-Yates shuffle para todas las opciones
    for (let i = opcionesObj.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [opcionesObj[i], opcionesObj[j]] = [opcionesObj[j], opcionesObj[i]];
    }

    opcionesObj.forEach((opt) => {
        const li = document.createElement("li");    // crea los <li>
        li.textContent = opt.texto;
        if (opt.isCorrect) li.dataset.correct = "true";
        opciones.appendChild(li);

        li.addEventListener("click", () => {
            if (respondida || tiempoTerminado) return;

            respondida = true;
            calcularYGuardarPuntos(); // Calcula y guarda los puntos

            if (li.dataset.correct === "true") {
                console.log("Correcto");
                li.classList.add("correcto");
                respuesta.textContent = "Respuesta correcta!";
                respuesta.style.display = "block";
                respuesta.classList.add("mensaje-respuesta-correcta");
            } else {
                console.log("Incorrecto");
                li.classList.add("incorrecto");
                const correctLi = opciones.querySelector('li[data-correct="true"]');
                if (correctLi) correctLi.classList.add("correcto");
                respuesta.textContent = "Respuesta incorrecta!";
                respuesta.style.display = "block";
                respuesta.classList.add("mensaje-respuesta-incorrecta");
            }

            const button = document.createElement("button");
            button.textContent = "Siguiente pregunta";
            section.appendChild(button);

            button.addEventListener("click", () => {
                preguntaActual++; // pasa a la sig pregunta.
                reiniciarTiempo(); // reinicia el temporizador a 25 segundos

                if (preguntaActual < game.questions.length) {
                    mostrarPregunta(game); // Empieza denuevo la funcion para mostrar la sig pregunta.
                } else {
                    section.innerHTML = "<h2>¡Quiz finalizado!</h2>";
                    window.location.href = '../Score/ScoreScreen.html';
                }
            });
        });
    });

}

const cajita = document.getElementById('show-time');
let numero = 25;
let intervaloTiempo;
if (cajita) cajita.textContent = numero;

function time_left() {
    numero--;
    if (cajita) cajita.textContent = numero;

    if (numero <= 0) {
        if (cajita) cajita.textContent = '0';
        finalizarQuiz("¡Se acabó el tiempo!");
    }
}

function reiniciarTiempo() {
    numero = 25;
    if (cajita) cajita.textContent = numero;
    clearInterval(intervaloTiempo);
    intervaloTiempo = setInterval(time_left, 1000);
}

intervaloTiempo = setInterval(time_left, 1000);

const score = document.getElementById('score');
let Points_Var = localStorage.getItem("puntos") || 0;
if (score) score.innerHTML = `${Points_Var}`;

