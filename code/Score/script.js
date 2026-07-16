// Obtener puntos momentáneos y totales
const puntosMomentaneos = parseInt(localStorage.getItem('puntosMomentaneos')) || 0;
const puntosActuales = parseInt(localStorage.getItem('puntos')) || 0;
const numero = document.getElementById('numero');
const CorrectAns = document.getElementById('CorrectAns');
const replay = document.getElementById('replay');
const leaderboard = document.getElementById('leaderboard');
const clearScoresButton = document.getElementById('clearScores');
const apiBaseUrl = 'https://quiz-api.cesar-kastli.workers.dev';
const gameId = localStorage.getItem('lastGameId') || new URLSearchParams(window.location.search).get('id');
const h2 = document.getElementById('h2')

// Función para incrementar el daily streak
function incrementDailyStreak() {
    const getDateKey = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };
    
    const lastPlayDate = localStorage.getItem('lastPlayDate');
    const currentDateKey = getDateKey();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = yesterday.toISOString().split('T')[0];

    let streakCount = parseInt(localStorage.getItem('dailyStreak')) || 0;

    // Si jugó ayer o es la primera vez, incrementar la racha
    if (!lastPlayDate || lastPlayDate === yesterdayKey || lastPlayDate === currentDateKey) {
        if (lastPlayDate !== currentDateKey) {
            streakCount++; // Incrementar solo si no jugó hoy
        }
    } else {
        // La racha se rompió, empezar de nuevo
        streakCount = 1;
    }

    localStorage.setItem('dailyStreak', streakCount);
    localStorage.setItem('lastPlayDate', currentDateKey);
    return streakCount;
}

// Actualizar el daily streak cuando se complete un juego
incrementDailyStreak();

// Sumar puntos momentáneos a los puntos totales
const puntosTotales = puntosActuales + puntosMomentaneos;
localStorage.setItem('puntos', puntosTotales);

// Mostrar puntos de esta sesión
document.getElementById('score').textContent = `Puntos: ${puntosMomentaneos}`;

if (puntosMomentaneos >= 20) {
    h2.innerHTML = `¡Increíble Trabajo!`
} else {
    h2.innerHTML = `¡Eres un perdedor!`
}

document.getElementById('return').addEventListener('click', () => {
    localStorage.setItem("CorrectAnswers", 0)
    location.reload()
    window.location.href = '../HomeScreen/index.html'
})

replay.addEventListener('click', () => {
    const gameToReplay = localStorage.getItem('lastGameId');

    localStorage.setItem('CorrectAnswers', 0);
    localStorage.setItem('puntosMomentaneos', 0);

    if (gameToReplay) {
        window.location.href = `../PlayingScreen/index.html?id=${gameToReplay}`;
    } else {
        window.location.href = '../HomeScreen/index.html';
    }
})

score = localStorage.getItem("puntos")
numero.innerHTML = `${score}`

correct = localStorage.getItem("CorrectAnswers")
CorrectAns.innerHTML = `respuestas correctas: ${correct}`

async function cargarScores() {
    if (!leaderboard) return;

    if (!gameId) {
        leaderboard.innerHTML = '<tr><td colspan="3">No hay un juego seleccionado.</td></tr>';
        return;
    }

    try {
        const response = await fetch(`${apiBaseUrl}/games/${gameId}/scores`);
        const scores = await response.json();

        if (!Array.isArray(scores) || scores.length === 0) {
            leaderboard.innerHTML = '<tr><td colspan="3">Aún no hay puntajes para este juego.</td></tr>';
            return;
        }

        leaderboard.innerHTML = scores
            .map((entry, index) => `
                <tr>
                    <td>${index + 1}</td>
                    <td>${entry.playerName || 'Jugador'}</td>
                    <td>${entry.score ?? 0}</td>
                </tr>
            `)
            .join('');
    } catch (error) {
        console.error('No se pudieron cargar los puntajes:', error);
        leaderboard.innerHTML = '<tr><td colspan="3">No se pudieron cargar los puntajes.</td></tr>';
    }
}

async function borrarScores() {
    if (!gameId || !clearScoresButton) return;

    const confirmar = confirm('¿Seguro que querés borrar los scores de este juego?');
    if (!confirmar) return;

    try {
        const response = await fetch(`${apiBaseUrl}/games/${gameId}/scores`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}`);
        }

        leaderboard.innerHTML = '<tr><td colspan="3">Se borraron los scores de este juego.</td></tr>';
    } catch (error) {
        console.error('No se pudieron borrar los puntajes:', error);
        leaderboard.innerHTML = '<tr><td colspan="3">No se pudieron borrar los puntajes.</td></tr>';
    }
}

if (clearScoresButton) {
    clearScoresButton.addEventListener('click', borrarScores);
}

cargarScores();

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function createParticle() {
    particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: Math.random() * 6 + 3,
        speedX: (Math.random() - 0.5) * 4,
        speedY: Math.random() * 4 + 2,
        rotation: (Math.random() - 0.5) * 5,
        color: `hsl(${Math.random() * 360}, 80%, 60%)`
    });
}

function updateParticle(particle) {
    particle.x += particle.speedX;
    particle.y += particle.speedY;

    particle.x += Math.sin(particle.y * 0.1) * Math.random() * 0.5;

    if (particle.y > canvas.height + 20) {
        particle.y = Math.random() * canvas.height - canvas.height;
        particle.x = Math.random() * canvas.width;
    }
}

function drawParticle(particle) {
    ctx.save();
    ctx.translate(particle.x, particle.y);
    ctx.rotate(particle.rotation);
    ctx.fillStyle = particle.color;

    ctx.fillRect(
        particle.size,
        particle.size / 4,
        particle.size * 2,
        particle.size / 2
    );

    ctx.restore();
}

for (let i = 0; i < localStorage.getItem('puntosMomentaneos'); i++) {
    createParticle()
}

localStorage.setItem('puntosMomentaneos', 0);

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((particle) => {
        updateParticle(particle);
        drawParticle(particle);
    });

    requestAnimationFrame(animate);
}

animate()