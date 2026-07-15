// Obtener puntos momentáneos y totales
const puntosMomentaneos = parseInt(localStorage.getItem('puntosMomentaneos')) || 0;
const puntosActuales = parseInt(localStorage.getItem('puntos')) || 0;
const numero = document.getElementById('numero')
const CorrectAns = document.getElementById('CorrectAns')
const replay = document.getElementById('replay')
// Sumar puntos momentáneos a los puntos totales
const puntosTotales = puntosActuales + puntosMomentaneos;
localStorage.setItem('puntos', puntosTotales);

// Mostrar puntos de esta sesión
document.getElementById('score').textContent = `Puntos: ${puntosMomentaneos}`;

document.getElementById('return').addEventListener('click', () => {
    localStorage.setItem("CorrectAnswers", 0)
    location.reload()
    window.location.href = '../HomeScreen/index.html'
})

replay.addEventListener('click', () => {
    console.log(`volviendo a null`)
})

score = localStorage.getItem("puntos")
numero.innerHTML = `${score}`

correct = localStorage.getItem("CorrectAnswers")
CorrectAns.innerHTML = `respuestas correctas: ${correct}`