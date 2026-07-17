const urlAPI = 'https://quiz-api.cesar-kastli.workers.dev/games';
const numero = document.getElementById('numero')
const exp = document.getElementById('exp')
let juegosDisponibles = []; // Almacenar todos los juegos para usar en random

async function obtainGames() {
    try {
        const respuesta = await fetch(urlAPI);
        const datos = await respuesta.json();
        juegosDisponibles = datos; // Guardar los juegos para usar en random play
        const contenedor = document.getElementById('juegos');
        contenedor.innerHTML = "";
        datos.forEach((element) => {
            const li = document.createElement("li");
            li.innerHTML = `<div id="play_content">
                <img src="${element.image}" alt="${element.title}">
                <span>${element.title}</span>
                <span>${element.difficulty}</span>
                <span>${element.questionCount}</span>
                <div class = "play-edit">
                <button class="jugar" data-id="${element.id}">
                    Jugar
                </button>
                <button class="editar" data-id="${element.id}">
                    <i class="fa-solid fa-pen"></i>
                </button>
                </div>
                </div>`;
            contenedor.appendChild(li);
        });
        document.querySelectorAll(".editar").forEach(boton => {
            boton.addEventListener("click", () => {
                const id = boton.dataset.id;
                window.location.href =
                    `../Add.Edit-GameScreen/index.html?id=${id}`;
            });
        });
        document.querySelectorAll(".jugar").forEach(boton => {
            boton.addEventListener("click", () => {
                const id = boton.dataset.id;
                window.location.href =
                    `../PlayingScreen/index.html?id=${id}`;
            });
        });
    }
    catch (error) {
        console.error("Error al conectar con la API:", error);
    }
}
obtainGames()
const addGame = document.getElementById('addGame')
let name = localStorage.getItem('nombreUsuario')
if (!name || name.trim() === '') {
    window.location.href = '../LoginScreen/login.html'
} else {
    const ready = document.getElementById('home/readyName')
    ready.innerHTML = `Ready for a challenge, ${name}?`
}
addGame.addEventListener('click', () => {
    window.location.href = '../Add.Edit-GameScreen/index.html'
})
if (!localStorage.getItem("puntos")) {
    localStorage.setItem("puntos", 0);
}
const score = localStorage.getItem("puntos")
numero.innerHTML = `${score}`
exp.innerHTML = `${score} XP`

// Selecciona un juego aleatorio y redirige a él
function playRandom() {
    // Verificar que hay juegos disponibles
    if (juegosDisponibles.length === 0) {
        alert("No hay juegos disponibles");
        return;
    }

    // Seleccionar un índice aleatorio
    const indiceAleatorio = Math.floor(Math.random() * juegosDisponibles.length);

    // Obtener el juego aleatorio
    const juegoAleatorio = juegosDisponibles[indiceAleatorio];

    // Redirigir a la pantalla de juego con el ID del juego aleatorio
    window.location.href = `../PlayingScreen/index.html?id=${juegoAleatorio.id}`;
}

// Agregar event listener al botón de Random Play
const randomPlayButton = document.getElementById("randomPlay");
if (randomPlayButton) {
    randomPlayButton.addEventListener("click", playRandom);
}

// const randomplay = document.getElementsByClassName("random-play-button");



function settings() {
    window.location.href = '../SettingsScreen/settings.html'
}

document.addEventListener('click', (event) => {
    const settingsButton = event.target.closest('#fa_gear')
    //             // En lugar de buscar el botón directamente, escuchamos los clics en toda la página
    //             // y preguntamos si hubo un cic en settingsButton o dentro de él. Esto lo hice así porque tuve problemas con encontrar el icono, ya que lo toma como svg.

    if (settingsButton) {
        settings();
    }
});