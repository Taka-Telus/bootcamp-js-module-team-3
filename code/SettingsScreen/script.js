
// AJUSTE DE SONIDO

const soundCheckbox = document.getElementById('sound-checkbox');

const savedSoundPreference = localStorage.getItem('sound');
const soundEnabled = savedSoundPreference === null ? true : savedSoundPreference === 'true';

soundCheckbox.checked = soundEnabled;

soundCheckbox.addEventListener('change', (evento) => {
  const isSoundEnabled = evento.target.checked;
  localStorage.setItem('sound', isSoundEnabled);
});


// AJUSTE DE VIBRACION

const vibrateCheckbox = document.getElementById('vibrate-checkbox');

const savedVibratePreference = localStorage.getItem('vibrate');
const vibrateEnabled = savedVibratePreference === null ? true : savedVibratePreference === 'true';

vibrateCheckbox.checked = vibrateEnabled;

vibrateCheckbox.addEventListener('change', (evento) => {
  const isVibrateEnabled = evento.target.checked;
  localStorage.setItem('vibrate', isVibrateEnabled);
});


const logout = document.getElementById("logout");

logout.addEventListener('click', (event) => {
    localStorage.setItem('nombreUsuario', "");
    window.location.href = '../LoginScreen/login.html'
    location.reload
    
});



const numero = document.getElementById('numero')
const exp = document.getElementById('exp')
score = localStorage.getItem("puntos")
numero.innerHTML = `${score}`
exp.innerHTML = `${score} XP`