const API = "https://quiz-api.cesar-kastli.workers.dev/games";

class GestionJuego {
  constructor() {
    this.form = document.getElementById("gameForm");
    this.questionsContainer = document.getElementById("questionsContainer");
    this.addButton = document.getElementById("addQuestion");
    this.deleteButton = document.getElementById("deleteButton");
    this.backButton = document.getElementById("backButton");
    this.exp = document.getElementById("exp");
    this.imageInput = document.getElementById("image");
    this.imagePreview = document.getElementById("imagePreview");

    this.initCommonListeners();
    this.renderExperience();
  }

  // Inicializamos eventos compartidos por ambas vistas
  initCommonListeners() {
    this.addButton.addEventListener("click", () => this.createQuestion());
    
    if (this.backButton) {
      this.backButton.addEventListener("click", () => {
        window.location.href = "../HomeScreen/index.html";
      });
    }

    this.imageInput.addEventListener("change", () => this.updateImagePreview());
    this.imageInput.addEventListener("input", () => this.updateImagePreview());

    this.form.addEventListener("submit", (e) => this.handleSubmit(e));
  }

  renderExperience() {
    const score = localStorage.getItem("puntos") || 0;
    if (this.exp) {
      this.exp.innerHTML = `${score} XP`;
    }
  }

  createQuestion(questionData = null) {
    const questionNumber = this.questionsContainer.children.length + 1;
    const questionDiv = document.createElement("div");
    questionDiv.className = "question";
    questionDiv.innerHTML = `
        <hr>
        <h4>Pregunta ${questionNumber}</h4>
        <label>Pregunta</label>
        <input type="text" class="questionText" value="${questionData ? questionData.text : ""}" required>
        <label>Respuesta A</label>
        <input type="text" class="option" value="${questionData ? questionData.options[0] : ""}" required>
        <label>Respuesta B</label>
        <input type="text" class="option" value="${questionData ? questionData.options[1] : ""}" required>
        <label>Respuesta C</label>
        <input type="text" class="option" value="${questionData ? questionData.options[2] : ""}" required>
        <label>Respuesta D</label>
        <input type="text" class="option" value="${questionData ? questionData.options[3] : ""}" required>
        <button type="button" class="deleteQuestion">Eliminar Pregunta</button>
    `;
    questionDiv.querySelector(".deleteQuestion").addEventListener("click", () => {
        questionDiv.remove();
        this.updateQuestionNumbers();
    });
    this.questionsContainer.appendChild(questionDiv);
  }

  updateQuestionNumbers() {
    const questions = document.querySelectorAll(".question");
    questions.forEach((question, index) => {
        question.querySelector("h4").textContent = `Pregunta ${index + 1}`;
    });
  }

  updateImagePreview() {
    const imageUrl = this.imageInput.value.trim();
    if (imageUrl) {
        this.imagePreview.src = imageUrl;
        this.imagePreview.style.display = "block";
        this.imagePreview.onerror = () => {
            this.imagePreview.style.display = "none";
        };
    } else {
        this.imagePreview.style.display = "none";
    }
  }

  showMessage(text, type = "info") {
    const message = document.getElementById("message");
    message.textContent = text;
    message.className = type;
    setTimeout(() => {
        message.textContent = "";
        message.className = "";
    }, 3000);
  }

  // Recolecta el estado actual de la trivia y las preguntas estructuradas
  obtenerDatosFormulario() {
    const questions = [];
    document.querySelectorAll(".question").forEach(question => {
        questions.push({
            text: question.querySelector(".questionText").value,
            options: Array.from(question.querySelectorAll(".option")).map(option => option.value)
        });
    });

    const baseGame = {
        title: document.getElementById("title").value,
        author: document.getElementById("author").value,
        description: document.getElementById("description").value,
        image: this.imageInput.value,
        difficulty: document.getElementById("difficulty").value
    };

    return { baseGame, questions };
  }

  async handleSubmit(e) {
    e.preventDefault();
    await this.procesarEnvio();
  }
}

class CrearJuego extends GestionJuego {
  constructor() {
    super();
    this.init();
  }

  init() {
    this.createQuestion(); // pregunta vacía por defecto
  }

  async procesarEnvio() {
    const { baseGame, questions } = this.obtenerDatosFormulario();
    try {
      // 1. Envía el juego base (sin preguntas, como dictaba tu API en el POST original)
      const response = await fetch(API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(baseGame)
      });

      if (!response.ok) throw new Error(await response.text());
      const savedGame = await response.json();

      // 2. Si hay preguntas, hace el PATCH complementario usando el ID devuelto
      if (questions.length > 0) {
          const patchResponse = await fetch(`${API}/${savedGame.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ questions })
          });
          if (!patchResponse.ok) throw new Error("No se pudieron guardar las preguntas.");
      }

      this.showMessage("Juego guardado correctamente.", "success");
      
      if (savedGame && savedGame.id) {
          setTimeout(() => {
              window.location.href = `?id=${savedGame.id}`;
          }, 1500);
      }
    } catch (error) {
        console.error(error);
        this.showMessage("No se pudo guardar el juego.", "error");
    }
  }
}

class EditarJuego extends GestionJuego {
  constructor(gameId) {
    super();
    this.gameId = gameId;
    this.init();
  }

  async init() {
    this.deleteButton.style.display = "inline-block";
    document.getElementById("pageTitle").textContent = "Editar Juego";
    
    this.deleteButton.addEventListener("click", () => this.eliminarJuego());
    await this.loadGame();
  }

  async loadGame() {
    try {
        const response = await fetch(`${API}/${this.gameId}`);
        if (!response.ok) throw new Error("No se pudo cargar.");

        const game = await response.json();

        document.getElementById("title").value = game.title || "";
        document.getElementById("author").value = game.author || "";
        document.getElementById("description").value = game.description || "";
        this.imageInput.value = game.image || "";
        document.getElementById("difficulty").value = game.difficulty || "Facil";
        this.updateImagePreview();

        this.questionsContainer.innerHTML = "";

        if (!game.questions || game.questions.length === 0) {
            this.createQuestion();
            return;
        }

        game.questions.forEach(question => this.createQuestion(question));
    } catch (error) {
        console.error(error);
        alert("No se pudo cargar el juego: " + error.message);
    }
  }

  async procesarEnvio() {
    const { baseGame, questions } = this.obtenerDatosFormulario();
    const gameFull = { ...baseGame, questions };

    try {
      const response = await fetch(`${API}/${this.gameId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(gameFull)
      });

      if (!response.ok) throw new Error(await response.text());

      this.showMessage("Juego guardado correctamente.", "success");
    } catch (error) {
        console.error(error);
        this.showMessage("No se pudo guardar el juego.", "error");
    }
  }

  async eliminarJuego() {
    if (!confirm("¿Seguro que quieres borrar este juego?")) return;
    try {
        const response = await fetch(`${API}/${this.gameId}`, { method: "DELETE" });
        if (!response.ok) throw new Error("No se pudo borrar.");
        
        this.showMessage("Juego eliminado.", "success");
        window.location.href = "../HomeScreen/index.html";
    } catch (error) {
        console.error(error);
        alert("Error al borrar el juego.");
    }
  }
}

const params = new URLSearchParams(window.location.search);
const gameId = params.get("id");

if (gameId) {
    new EditarJuego(gameId);
} else {
    new CrearJuego();
}
