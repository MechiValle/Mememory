//Creamos un bool que de true cuando la carta está dada vuelta
let flippedCard = false;

//Creamos variables que contengan la primera y la segunda carta.
let card1, card2;

//Creamos el bool lockBoard para impedir que el usuario de vuelta más de dos cartas a la vez
let lockBoard = false;

// Creamos una funcion que va a recibir por parametro los datos que vienen del Endpoint
function createCard(imgFront, imgBack, classFront, classBack, dataId) {
    // creamos un div con el metodo createElement() (Manipulacion del DOM)
    const container = document.createElement("div");
    // creamos un template literal (bloque de HTML en JS) que contiene placeholders
    // que nos van a permitir recibir los argumentos de la funcion
    const card = `
    <div class="card" data-match="${dataId}">
        <img class="${classFront}" src="${imgFront}" alt="" />
        <img class="${classBack}" src="${imgBack}" alt="" />
    </div>`;
    // inyectamos la informacion card (template literal) dentro del div que creamos anteriormente
    container.innerHTML = card;

    return container;
}

// creamos una funcion para crear el board
function createBoard(cards) {
    // creamos un section con el metodo createElement() (Manipulacion del DOM)
    const grid = document.createElement("section");
    // agregamos a la section a la clase grid
    grid.classList.add("grid");
    // agregamos a la section un ID tambien llamado grid
    grid.setAttribute("id", "grid");
    // guardaoms la data que viene del Endpoint en variables para poder utilizarlas luego en las funciones Create Card
    const imgsFront = cards.frontFace.imagesSrc;
    const imgBack = cards.backFace.src;
    const classFront = cards.frontFace.class;
    const classBack = cards.backFace.class;

    // guardamos en una variable el elemento HTML con ID board
    const board = document.getElementById("board");

    // Recorremos el array de imagenes que se encuentra en nuestro Endpoint y en cada iteracion ejecutamos la funcion createCard() que nos devuelve el doble de cards.
    imgsFront.forEach((imgFront) => {
        const cardElement = createCard(
            imgFront,
            imgBack,
            classFront,
            classBack,
            imgFront
        );
        const cardElement2 = createCard(
            imgFront,
            imgBack,
            classFront,
            classBack,
            imgFront
        );
        // Con el metodo appendChild insertamos las cards (HTML) en el grid
        grid.appendChild(cardElement);
        grid.appendChild(cardElement2);
    });
    // Con el metodo appendChild insertamos el grid en el board (unico elemento HTML que creamos en index.html)
    board.appendChild(grid);
}

function flipCard() {
    //Chequeamos que esta función se ejecute solo cuando this está asignado a la primera carta, para evitar que se pueda matchear haciendo dos clicks sobre una misma carta
    if (this === card1) return;

    if (lockBoard) return;
    //Agregamos la clase 'flip' a la carta una vez que se clickea
    this.classList.add("flip");
    if (!flippedCard) {
        //Pasamos el bool a true
        flippedCard = true;
        //Asignamos el valor de "this" a la primera carta clickeada
        card1 = this;
    } else {
        //Pasamos el bool a false
        flippedCard = false;
        card2 = this;
        matchTwo();
    }
}

function matchTwo() {
    //Vamos a chequear si las dos coinciden (usando el atributo data)
    if (card1.dataset.match === card2.dataset.match) {
        disableCards();
    } else {
        flipBack();
    }
}

// Creamos un contador de tiempo
let count = 0;
const counterElement = document.getElementById("time");
// Creamos una variable que donde se encuentra el estado del juego,
// y nos va a permitir verificar si el juego termino.
let gameFinished = false;

// Creamos una funcion setInterval que se ejecuta cada un segundo mientras el juego no haya terminado,
// suma 1 al contador de tiempo y lo muestra en el html.
let finalCount = setInterval(() => {
    if (!gameFinished) {
        count++;
        counterElement.innerText = count;
    }
}, 1000);

function disableCards() {
    card1.removeEventListener("click", flipCard);
    card2.removeEventListener("click", flipCard);
    // Cuando encontramos una pareja de cartas, a cada una le añadimos el atributo data-matched
    card1.dataset.matched = true;
    card2.dataset.matched = true;
    // El juego finaliza cuando las 12 cartas tienen el atributo data-matched
    gameFinished = document.querySelectorAll("[data-matched]").length === 12;

    // Agregamos un boton que solo sera visible cuando el juego haya finalizado
    if (gameFinished) {
        document.getElementById("replay").classList.add("show");
    }
    reset();
}

// Agregamos la logica al boton para recargar la pagina una vez finalizado el juego
const replayButton = document.getElementById("replay");

replayButton.addEventListener("click", () => {
    window.location.reload();
});

function flipBack() {
    lockBoard = true;
    setTimeout(() => {
        card1.classList.remove("flip");
        card2.classList.remove("flip");
        lockBoard = false;
        reset();
    }, 500);
}

//Creamos una función para devolver todo a su estado inicial después de cada jugada
function reset() {
    [flippedCard, lockBoard] = [false, false];
    [card1, card2] = [null, null];
}

// Creamos una funcion para ordenar aleatoriamente las cartas
function shuffle() {
    const grid = document.getElementById("grid");
    // Utilizamos el spread operator para convertir un HTML collection en un Array
    // y poder asi recorrerlo con un For Each, que servira para cambiar el orden de los elementos
    const cards = [...grid.children];
    cards.forEach((card) => {
        let randomPos = Math.floor(Math.random() * 12);
        card.style.order = randomPos;
    });
}

// hacemos un fetch para traer la informacion de nuestro Endpoint
// movemos la ejecucion de la funcion createBoard, la declaracion de cards, el addEventlistener, y la funcion shuffle

fetch("https://memery-api.herokuapp.com/api/images")
    .then((response) => response.json())
    .then((data) => {
        //ejecutamos la funcion createBoard utlizando como argumento la data obtenida desde nuestro Endpoint
        createBoard(data);

        //Seleccionar todas las cartas con su clase para después usarlas en las funciones
        const cards = document.querySelectorAll(".card");

        //Por cada carta, cuando el usuario clickea, se va a llamar a la funcion flipCard
        cards.forEach((card) => card.addEventListener("click", flipCard));

        shuffle();
    });
