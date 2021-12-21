//Creamos un bool que de true cuando la carta está dada vuelta

let flippedCard = false;

//Creamos variables que contengan la primera y la segunda carta.

let card1, card2;

//Creamos el bool lockBoard para impedir que el usuario de vuelta más de dos cartas a la vez
let lockBoard = false;

//Seleccionar todas las cartas con su clase para después usarlas en las funciones

const cards = document.querySelectorAll(".card");

//Por cada carta, cuando el usuario clickea, se va a llamar a la funcion flipCard

cards.forEach((card) => card.addEventListener("click", flipCard));

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
setInterval(() => {
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

    reset();
}

function flipBack() {
    lockBoard = true;
    setTimeout(() => {
        card1.classList.remove("flip");
        card2.classList.remove("flip");
        lockBoard = false;
        reset();
    }, 1000);
}

//Creamos una función para devolver todo a su estado inicial después de cada jugada
function reset() {
    [flippedCard, lockBoard] = [false, false];
    [card1, card2] = [null, null];
}
