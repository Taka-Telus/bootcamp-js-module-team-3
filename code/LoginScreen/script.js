const inputNombre = document.querySelector("#input-nombre");
const saludo = document.querySelector("#saludo");
const btnGuardar = document.querySelector("#btn-guardar");

const nombreGuardado = localStorage.getItem('nombreUsuario');

if (nombreGuardado) {
    console.log('Ingresado.')
}

btnGuardar.addEventListener("click", () => {
    const nombreIngresado = inputNombre.value.trim();
    if (nombreIngresado !== "") {
        location.reload()
        localStorage.setItem('nombreUsuario', nombreIngresado);
    }
});

let name = localStorage.getItem('nombreUsuario')

if (name.trim() || name != '') {
    window.location.href = '../HomeScreen/index.html'
}