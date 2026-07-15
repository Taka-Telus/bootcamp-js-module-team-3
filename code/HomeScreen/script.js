const urlAPI = 'https://quiz-api.cesar-kastli.workers.dev/games';

        async function obtainGames() {
            try {
                const respuesta = await fetch(urlAPI);
                const datos = await respuesta.json();
                const contenedor = document.getElementById('juegos');
                contenedor.innerHTML = "";
                datos.forEach((element) => {
                    const li = document.createElement("li");
                    li.innerHTML = `<div id="play_content">
                    <img src="${element.image}" alt="${element.title}">
                    <span>${element.title}</span>
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


        // const randomplay = document.getElementsByClassName("random-play-button");

        

        // function settings() {
        //     const main = document.querySelector(".main");
        //     main.innerHTML = "";
        // }

        // document.addEventListener('click', (event) => {
        //     const settingsButton = event.target.closest('#fa_gear') 
        //             // En lugar de buscar el botón directamente, escuchamos los clics en toda la página
        //             // y preguntamos si hubo un cic en settingsButton o dentro de él. Esto lo hice así porque tuve problemas con encontrar el icono, ya que lo toma como svg.
            
        //     if (settingsButton) {
        //                         settings();
        //     }
        // });