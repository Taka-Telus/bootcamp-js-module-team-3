const baseUrl = "https://quiz-api.cesar-kastli.workers.dev";

const params = new URLSearchParams(window.location.search);
const gameId = params.get("id");

let preguntaActual = 0;
let tiempoTerminado = false; // Bandera para saber si se acabó el tiempo
let numero = 25; // Tiempo inicial en segundos
let intervaloTiempo;
let CorrectAns = 0;
let k = 100
// Resetear puntos momentáneos al inicio de cada sesión de juego (sin sumar al anterior)
localStorage.setItem("puntosMomentaneos", 0);
if (!localStorage.getItem("puntos")) {
    localStorage.setItem("puntos", 0);
}

const section = document.getElementById("section");
const exp = document.getElementById("exp");
const cajita = document.getElementById('show-time');
actualizarTiempoDisplay();
actualizarPuntaje();

function actualizarTiempoDisplay() {
    if (cajita) {
        cajita.textContent = numero;
        cajita.style.display = 'block';
        cajita.style.textAlign = 'center';
        cajita.style.margin = '90px auto 10px';
        cajita.style.fontSize = '1.5rem';
        cajita.style.fontWeight = '700';
        cajita.style.color = '#1F7D0A';
    }
}

function actualizarPuntaje() {
    const puntosActuales = parseInt(localStorage.getItem("puntos")) || 0;
    const puntosSesion = parseInt(localStorage.getItem("puntosMomentaneos")) || 0;

    if (exp) {
        exp.textContent = `${puntosActuales + puntosSesion} XP`;
    }
}

async function obtenerGame() {
    if (!gameId) {
        section.innerHTML = "<h2>No se encontró ningún juego.</h2>";
        return;
    }

    try {
        const response = await fetch(`${baseUrl}/games/${gameId}`);
        const game = await response.json();

        mostrarPregunta(game);
        intervaloTiempo = setInterval(time_left, 1000);
    } catch (error) {
        console.error(error);
        section.innerHTML = "<h2>Error al cargar el juego.</h2>";
    }
}
// Llamar a la función para obtener el juego y mostrar la primera pregunta
obtenerGame();

function finalizarQuiz(mensaje) {
    // Marcar como finalizado y detener el temporizador
    tiempoTerminado = true;
    clearInterval(intervaloTiempo);
    section.innerHTML = `<h2>${mensaje}</h2>`;
    setTimeout(() => {
        window.location.href = '../Score/ScoreScreen.html';
    }, 2000);
}

function calcularYGuardarPuntos() {
    // Calcular puntos: tiempo restante * 4
    // Si no hay tiempo válido, 0 puntos
    const puntosPregunta = (typeof numero === 'number' && numero > 0) ? Math.round((25/numero)*k) : 0;

    // Obtener los puntos momentáneos actuales
    const puntosActuales = parseInt(localStorage.getItem("puntosMomentaneos")) || 0;
    const puntosTotal = puntosActuales + puntosPregunta;

    localStorage.setItem("puntosMomentaneos", puntosTotal);
    console.log(`Puntos ganados: ${puntosPregunta}, Total momentáneo: ${puntosTotal}`);
}

function mostrarPregunta(game) {
    if (tiempoTerminado) return;

    // Limpiar el contenido anterior
    section.innerHTML = "";

    const question = document.createElement("p");
    question.textContent = game.questions[preguntaActual].text;
    section.appendChild(question);

    const respuesta = document.createElement("p");
    respuesta.style.display = "none";
    question.after(respuesta);
    respuesta.classList.add("mensaje-respuesta");

    const opciones = document.createElement("ul");
    section.appendChild(opciones);

    // Bandera para evitar múltiples respuestas a la misma pregunta
    let respondida = false;

    const opcionesOriginales = game.questions[preguntaActual].options;
    const opcionesObj = opcionesOriginales.map((texto, idx) => ({
        texto,
        isCorrect: idx === 0
    }));

    // Algoritmo para mezclar las opciones aleatoriamente
    for (let i = opcionesObj.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [opcionesObj[i], opcionesObj[j]] = [opcionesObj[j], opcionesObj[i]];
    }

    opcionesObj.forEach((opt) => {
        const li = document.createElement("li");
        li.textContent = opt.texto;
        // Marcar cuál es la respuesta correcta (con atributo data)
        if (opt.isCorrect) li.dataset.correct = "true";

        opciones.appendChild(li);

        li.addEventListener("click", () => {
            if (respondida || tiempoTerminado) return;

            respondida = true;

            const sound = localStorage.getItem('sound') !== 'false';
            const vibrate = localStorage.getItem('vibrate') !== 'false';

            if (li.dataset.correct === "true") {
                console.log("Correcto");
                li.classList.add("correcto");
                CorrectAns++
                console.log(CorrectAns)
                // Mostrar mensaje de éxito
                respuesta.textContent = "¡Respuesta correcta!";
                respuesta.style.display = "block";
                respuesta.classList.add("mensaje-respuesta-correcta");

                // Reproducir sonido de acierto
                if (sound) {
                    const correctSound = new Audio('./correctSound.mp3');
                    correctSound.play();
                }
                if (vibrate) {
                    li.classList.add("shake-element");
                }


                calcularYGuardarPuntos();
                actualizarPuntaje();

            } else {
                console.log("Incorrecto");

                li.classList.add("incorrecto");

                const correctLi = opciones.querySelector('li[data-correct="true"]');
                if (correctLi) correctLi.classList.add("correcto");
                respuesta.textContent = "¡Respuesta incorrecta!";
                respuesta.style.display = "block";
                respuesta.classList.add("mensaje-respuesta-incorrecta");

                // Reproducir sonido de error
                if (sound) {
                    const wrongSound = new Audio('./wrongSound.mp3');
                    wrongSound.play();
                }

            }

            const button = document.createElement("button");
            button.textContent = "Siguiente pregunta";
            section.appendChild(button);

            // EVENT LISTENER de Cuando se hace click en "Siguiente pregunta"
            button.addEventListener("click", () => {
                // Pasar a la siguiente pregunta
                preguntaActual++;
                reiniciarTiempo();

                // Verificar si hay más preguntas
                if (preguntaActual < game.questions.length) {
                    mostrarPregunta(game);
                } else {
                    localStorage.setItem("CorrectAnswers", CorrectAns)
                    cajita.textContent = ''
                    section.innerHTML = "<h2>¡Quiz finalizado!</h2>";
                    setTimeout(() => {
                        window.location.href = '../Score/ScoreScreen.html';
                    }, 1000);
                }
            });
        });
    });
}

function time_left() {
    // Decrementar un segundo
    numero--;

    // Actualizar el display del tiempo
    actualizarTiempoDisplay();

    // Si el tiempo se acabó, finalizar el quiz
    if (numero <= 0) {
        if (cajita) cajita.textContent = '0';
        finalizarQuiz("¡Se acabó el tiempo!");
    }
}

function reiniciarTiempo() {
    numero = 25;
    actualizarTiempoDisplay();
    clearInterval(intervaloTiempo);
    intervaloTiempo = setInterval(time_left, 1000);
}