const game1 = {
  "id": "g1",
  "title": "Mundial 2026",
  "author": "Cátedra",
  "image": "https://digitalhub.fifa.com/transform/598a1d22-62b6-486b-849c-e8bf55894179/FIFA_FWC26_Tournament-Thumbnail-4-3",
  "questions": [
    {
      "id": "q1",
      "text": "¿Quién ganó el Mundial 2022?",
      "options": [
        "Argentina",
        "Francia",
        "Brasil",
        "Croacia"
      ]
    },
    {
      "id": "q2",
      "text": "¿En qué países se juega el Mundial 2026?",
      "options": [
        "Estados Unidos, Canadá y México",
        "Qatar",
        "Rusia",
        "Brasil"
      ]
    }
  ],
  "difficulty": "Fácil"
}

// pregunta 1
const question = document.createElement("p");
question.textContent = game1.questions[0].text;
const section = document.getElementById("section");
section.appendChild(question);

// opciones 1
const opciones = document.createElement("ul");
section.appendChild(opciones);

game1.questions[0].options.forEach((textoOpcion) => {
    const li = document.createElement("li");
    li.textContent = textoOpcion;
    opciones.appendChild(li);


    li.addEventListener("click", () => {

    let respuestaCorrecta;

    if (textoOpcion === game1.questions[0].options[0]) {
        respuestaCorrecta = true;
        console.log("Correcto");
        li.classList.add('correcto')
    } else {
        respuestaCorrecta = false;
        console.log("correcto");
        li.classList.add('incorrecto')
    }
    });
});