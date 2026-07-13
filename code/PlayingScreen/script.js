


const baseUrl = "https://quiz-api.cesar-kastli.workers.dev";
let preguntaActual = 0; // variable para asignar la posición de cada pregunta.

const section = document.getElementById("section");

let indice = 2

async function obtenerGame() {
    const response = await fetch(`${baseUrl}/games`);      // Obtiene la lista de juegos
    const games = await response.json();                   // Convierte la respuesta a JSON, sin esto no se puede acceder a los datos de la respuesta.
    const gameId = games[indice]?.id;                           // crea gameId con el id del objeto indicado

    if (!gameId) {                                         // si no hay id, significa que no hay juegos.
        section.innerHTML = "<h2>No se encontró ningún juego.</h2>";
        return;
    }

    const gameResponse = await fetch(`${baseUrl}/games/${gameId}`); // Obtiene el juego con el id especificado
    const game = await gameResponse.json();                         // Convierte la respuesta a JSON, y nombra 'game' al objeto.

    mostrarPregunta(game); // Esta funcion muestra cada pregunta con sus respuestas.
}

obtenerGame();  // Llama a la funcion para obtener el juego y mostrar la primera pregunta.

function mostrarPregunta(game) {

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

    game.questions[preguntaActual].options.forEach((textoOpcion) => {

        const li = document.createElement("li");    // crea los <li>
        li.textContent = textoOpcion;
        opciones.appendChild(li);

        li.addEventListener("click", () => {

            if (respondida) return;

            respondida = true;
            
            if (textoOpcion === game.questions[preguntaActual].options[0]) {
                console.log("Correcto");
                li.classList.add("correcto");
                respuesta.textContent = "Respuesta correcta!";
                respuesta.style.display = "block";
                respuesta.classList.add("mensaje-respuesta-correcta")
            } else {
                console.log("Incorrecto");
                li.classList.add("incorrecto");
                opciones.children[0].classList.add("correcto");
                respuesta.textContent = "Respuesta incorrecta!";
                respuesta.style.display = "block";
                respuesta.classList.add("mensaje-respuesta-incorrecta")
            }

            const button = document.createElement("button");
            button.textContent = "Siguiente pregunta";
            section.appendChild(button);

            button.addEventListener("click", () => {

                preguntaActual++; // pasa a la sig pregunta.

                if (preguntaActual < game.questions.length) {
                    mostrarPregunta(game); // Empieza denuevo la funcion para mostrar la sig pregunta.
                } else {
                    section.innerHTML = "<h2>¡Quiz finalizado!</h2>";
                }

            });

        });

    });

}