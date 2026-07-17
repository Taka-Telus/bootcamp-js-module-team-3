const exp = document.getElementById("exp");
exp.innerHTML = `${localStorage.getItem('puntos')}`


const soundCheckbox = document.getElementById('sound-checkbox');
const vibrateCheckbox = document.getElementById('vibrate-checkbox');
const saveButton = document.getElementById('save-settings');
const settingsMessage = document.getElementById('settingsMessage');

function showSettingsMessage(text, type = 'info') {
  if (!settingsMessage) return;
  settingsMessage.textContent = text;
  settingsMessage.className = `settings-message ${type}`;
  setTimeout(() => {
    settingsMessage.textContent = '';
    settingsMessage.className = 'settings-message';
  }, 4000);
}

// AJUSTE DE SONIDO

const savedSoundPreference = localStorage.getItem('sound') === 'true';
let soundEnabled = savedSoundPreference;

// AJUSTE DE VIBRACION

const savedVibratePreference = localStorage.getItem('vibrate') === 'true';
let vibrateEnabled = savedVibratePreference;

soundCheckbox.checked = soundEnabled;
vibrateCheckbox.checked = vibrateEnabled;


// parte de localStorage y "guardar cambios"
saveButton.addEventListener('click', function () {
  try {
    localStorage.setItem('sound', soundCheckbox.checked);
    localStorage.setItem('vibrate', vibrateCheckbox.checked);
    showSettingsMessage('Cambios guardados correctamente.', 'success');
  } catch (error) {
    console.error(error);
    showSettingsMessage(error.message || 'Error al guardar los cambios.', 'error');
  }
});
// a sound y a vibrate le damos el valor de la casilla de checkBox, una vez que se haya clickeado el boton Guardar Cambios.




const logout = document.getElementById('logout');

logout.addEventListener('click', (event) => {
  localStorage.setItem('nombreUsuario', "");
  window.location.href = '../LoginScreen/login.html'
  location.reload()

});