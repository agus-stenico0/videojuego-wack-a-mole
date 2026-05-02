
let puntaje = 0;
let tiempoRestante = 30;
let intervaloTopo = null; 
let intervaloTimer = null; 
let juegoActivo = false;
let hoyoActivo = null; 


const displayPuntaje = document.querySelector("#puntaje");
const displayTiempo = document.querySelector("#tiempo");
const displayHighScore = document.querySelector("#high-score");
const btnIniciar = document.querySelector("#btn-iniciar");
const hoyos = document.querySelectorAll(".hoyo");
const mensajeFinal = document.querySelector("#mensaje-final");
const textoFinal = document.querySelector("#texto-final");


function cargarHighScore() {
  const highScore = localStorage.getItem('whack-highscore')
  displayHighScore.textContent = highScore !== null? highScore: '0'
}


function actualizarHighScore() {
  const highScore = localStorage.getItem('whack-highscore')

  if(puntaje > Number(highScore) || 0) {
    localStorage.setItem('whack-highscore', puntaje)
    displayHighScore.textContent = puntaje
    return true
  }
  return false
}


function hoyoAleatorio() {
  const numeroAleatorio = Math.floor(Math.random() * hoyos.length)
  return hoyos[numeroAleatorio]
}


function mostrarTopo() {
    if(hoyoActivo !== null) {
        hoyoActivo.classList.remove('visible')
    }
    hoyoActivo = hoyoAleatorio()
    hoyoActivo.classList.add('visible')

    setTimeout(() => {
        if(hoyoActivo !== null) {
            hoyoActivo.classList.remove('visible')
        }
    }, 800)
}


function golpearTopo(evento) {
  if(!juegoActivo) return

  const hoyo = evento.currentTarget
  
  if(!hoyo.classList.contains('visible')) return

  puntaje++
  displayPuntaje.textContent = puntaje

  hoyo.classList.remove('visible')
  hoyo.classList.add('golpeado')

  setTimeout(() => {
    hoyo.classList.remove('golpeado')
  }, 300);

  hoyoActivo = null
}


function iniciarPartida() {
  puntaje = 0
  tiempoRestante = 30
  juegoActivo = true

  displayPuntaje.textContent = puntaje
  displayTiempo.textContent = tiempoRestante
  cargarHighScore()
  mensajeFinal.classList.add('oculto')

  btnIniciar.disabled = true

  mostrarTopo()

  intervaloTopo = setInterval(mostrarTopo, 900)
  intervaloTimer = setInterval(() => {
    tiempoRestante--
    displayTiempo.textContent = tiempoRestante

    if(tiempoRestante <= 0) terminarPartida()
  }, 1000)
}


function terminarPartida() {
  juegoActivo = false

  clearInterval(intervaloTopo)
  clearInterval(intervaloTimer)

  if(hoyoActivo !== null) {
    hoyoActivo.classList.remove('visible')
    hoyoActivo = null
  }

  const recordScore = actualizarHighScore()

  if(recordScore) {
    textoFinal.textContent = 'Felicidades: Has superado el Record!!'
  }
    
  mensajeFinal.classList.remove('oculto')
  btnIniciar.disabled = false
  btnIniciar.textContent = 'Jugar de nuevo'
}

btnIniciar.addEventListener('click', iniciarPartida)

hoyos.forEach(hoyo => {
    hoyo.addEventListener('click', golpearTopo)
})
cargarHighScore();

