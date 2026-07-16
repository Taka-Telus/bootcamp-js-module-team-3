        const API = "https://quiz-api.cesar-kastli.workers.dev/games";
        const form = document.getElementById("gameForm");
        const questionsContainer = document.getElementById("questionsContainer");
        const addButton = document.getElementById("addQuestion");
        const deleteButton = document.getElementById("deleteButton");
        const backButton = document.getElementById("backButton");
        const exp = document.getElementById("exp");
        const params = new URLSearchParams(window.location.search);
        const gameId = params.get("id");

        const score = localStorage.getItem("puntos") || 0;
        if (exp) {
            exp.innerHTML = `${score} XP`;
        }

        function createQuestion(questionData = null) {
            const questionNumber = questionsContainer.children.length + 1;
            const questionDiv = document.createElement("div");
            questionDiv.className = "question";
            questionDiv.innerHTML = `
        <hr>
        <h4>Pregunta ${questionNumber}</h4>
        <label>Pregunta</label>
        <input
            type="text"
            class="questionText"
            value="${questionData ? questionData.text : ""}"
            required>
        <label>Respuesta A</label>
        <input
            type="text"
            class="option"
            value="${questionData ? questionData.options[0] : ""}"
            required>
        <label>Respuesta B</label>
        <input
            type="text"
            class="option"
            value="${questionData ? questionData.options[1] : ""}"
            required>
        <label>Respuesta C</label>
        <input
            type="text"
            class="option"
            value="${questionData ? questionData.options[2] : ""}"
            required>
        <label>Respuesta D</label>
        <input
            type="text"
            class="option"
            value="${questionData ? questionData.options[3] : ""}"
            required>
        <button
            type="button"
            class="deleteQuestion">
            Eliminar Pregunta
        </button>
    `;
            questionDiv.querySelector(".deleteQuestion").addEventListener("click", () => {
                questionDiv.remove();
                updateQuestionNumbers();
            });
            questionsContainer.appendChild(questionDiv);
        }
        function updateQuestionNumbers() {
            const questions = document.querySelectorAll(".question");
            questions.forEach((question, index) => {
                question.querySelector("h4").textContent =
                    `Pregunta ${index + 1}`;
            });
        }
        addButton.addEventListener("click", () => {
            createQuestion();
        });
        function showMessage(text, type = "info") {
            const message = document.getElementById("message");
            message.textContent = text;
            message.className = type;
            setTimeout(() => {
                message.textContent = "";
                message.className = "";
            }, 3000);
        }
        async function loadGame() {
            if (!gameId) {
                createQuestion();
                return;
            }
            try {
                deleteButton.style.display = "inline-block";
                document.getElementById("pageTitle").textContent = "Editar Juego";

                const response = await fetch(`${API}/${gameId}`);
                console.log("Response status:", response.status);

                if (!response.ok)
                    throw new Error("No se pudo cargar.");

                const game = await response.json();
                console.log("Game data:", game);
                console.log("Questions:", game.questions);

                document.getElementById("title").value = game.title || "";
                document.getElementById("author").value = game.author || "";
                document.getElementById("description").value = game.description || "";
                document.getElementById("image").value = game.image || "";
                document.getElementById("difficulty").value = game.difficulty || "Facil";
                updateImagePreview();

                questionsContainer.innerHTML = "";

                if (!game.questions || game.questions.length === 0) {
                    console.warn("No hay preguntas");
                    createQuestion();
                    return;
                }

                game.questions.forEach((question, index) => {
                    console.log(`Creating question ${index}:`, question);
                    createQuestion(question);
                });
            }
            catch (error) {
                console.error("Error completo:", error);
                alert("No se pudo cargar el juego: " + error.message);
            }
        }
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const questions = [];
            document.querySelectorAll(".question").forEach(question => {
                questions.push({
                    text: question.querySelector(".questionText").value,
                    options: Array.from(
                        question.querySelectorAll(".option")
                    ).map(option => option.value)
                });
            });
            const baseGame = {
                title: document.getElementById("title").value,
                author: document.getElementById("author").value,
                description: document.getElementById("description").value,
                image: document.getElementById("image").value,
                difficulty: document.getElementById("difficulty").value
            };
            const game = {
                ...baseGame,
                questions: questions
            };
            try {
                let response;
                if (gameId) {
                    response = await fetch(API + "/" + gameId, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(game)
                    });
                }
                else {
                    response = await fetch(API, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(baseGame)
                    });
                }
                if (!response.ok) {
                    const error = await response.text();
                    throw new Error(error);
                }
                const savedGame = await response.json();

                if (!gameId && questions.length > 0) {
                    const questionsPayload = { questions };
                    const patchResponse = await fetch(API + "/" + savedGame.id, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(questionsPayload)
                    });
                    if (!patchResponse.ok) {
                        const error = await patchResponse.text();
                        throw new Error("No se pudieron guardar las preguntas: " + error);
                    }
                }

                showMessage("Juego guardado correctamente.", "success");

                if (!gameId && savedGame && savedGame.id) {
                    setTimeout(() => {
                        window.location.href = `?id=${savedGame.id}`;
                    }, 1500);
                }
            }
            catch (error) {
                console.error(error);
                showMessage("No se pudo guardar el juego.", "error");
            }
        });
        deleteButton.addEventListener("click", async () => {
            if (!confirm("¿Seguro que quieres borrar este juego?"))
                return;
            try {
                const response = await fetch(API + "/" + gameId, {
                    method: "DELETE"
                });
                if (!response.ok)
                    throw new Error("No se pudo borrar.");
                showMessage("Juego eliminado.", "success");
                window.location.href =
                    "../HomeScreen/index.html";
            }
            catch (error) {
                console.error(error);
                alert("Error al borrar el juego.");
            }
        });
        if (backButton) {
            backButton.addEventListener("click", () => {
                window.location.href =
                    "../HomeScreen/index.html";
            });
        }

        // Función para actualizar el preview de la imagen
        function updateImagePreview() {
            const imageInput = document.getElementById("image");
            const imagePreview = document.getElementById("imagePreview");
            const imageUrl = imageInput.value.trim();

            if (imageUrl) {
                imagePreview.src = imageUrl;
                imagePreview.style.display = "block";
                imagePreview.onerror = () => {
                    imagePreview.style.display = "none";
                };
            } else {
                imagePreview.style.display = "none";
            }
        }

        // Event listener para actualizar preview cuando cambia la URL
        document.getElementById("image").addEventListener("change", updateImagePreview);
        document.getElementById("image").addEventListener("input", updateImagePreview);

        loadGame();
        updateImagePreview();


//settingsscreen
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