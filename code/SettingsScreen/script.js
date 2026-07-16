const exp = document.getElementById("exp");
exp.innerHTML = `${localStorage.getItem('puntos')}`





const soundCheckbox = document.getElementById('sound-checkbox');
const vibrateCheckbox = document.getElementById('vibrate-checkbox');
const saveButton = document.getElementById('save-settings');




// AJUSTE DE SONIDO

const savedSoundPreference = localStorage.getItem('sound');
// savedSoucePreference es una variable que obtiene el valor de sound, definido antes.

let soundEnabled; // creo una variable para indicar cuándo esta activado

if (savedSoundPreference === true) {
  soundEnabled = true;
} else {
  soundEnabled = false;
}
// pregunta si el valor definido antes es true. Si lo es, soundEnable es true. Si no, es false.



// AJUSTE DE VIBRACION

const savedVibratePreference = localStorage.getItem('vibrate');
let vibrateEnabled;

if (savedVibratePreference === true) {
  vibrateEnabled = true;
} else {
  vibrateEnabled = false;
}



soundCheckbox.checked = soundEnabled;       // soundEnabled tendra el valor que le demos a soundCheckBox. Si marcamos la casilla, soundEnabled = true.
vibrateCheckbox.checked = vibrateEnabled;


// parte de localStorage y "guardar cambios"
saveButton.addEventListener('click', function () {
  localStorage.setItem('sound', soundCheckbox.checked);
  localStorage.setItem('vibrate', vibrateCheckbox.checked);
});
// a sound y a vibrate le damos el valor de la casilla de checkBox, una vez que se haya clickeado el boton Guardar Cambios.




const logout = document.getElementById('logout');

logout.addEventListener('click', (event) => {
    localStorage.setItem('nombreUsuario', "");
    window.location.href = '../LoginScreen/login.html'
    location.reload

});