// iniciador para los iconos de lucide //

document.addEventListener("DOMContentLoaded", () => {
  // inicializar íconos de Lucide
  if (window.lucide) {
    lucide.createIcons();
  }});

  // reproducir video

  // Selecciona todas las tarjetas que contienen un video.
const videoCards = document.querySelectorAll('[data-video-card]');


// Detecta si el dispositivo dispone de ratón/trackpad y puede usar hover.
const hoverAvailable = window.matchMedia('(hover: hover) and (pointer: fine)');


/**
 * Actualiza el texto, el icono y los atributos accesibles del botón.
 * @param {HTMLElement} card - Tarjeta que contiene el video.
 * @param {boolean} isPlaying - Indica si el video se está reproduciendo.
 */
function updateVideoButton(card, isPlaying) {
  const toggleButton = card.querySelector('[data-video-toggle]');
  const toggleText = card.querySelector('[data-toggle-text]');
  const toggleIcon = card.querySelector('[data-toggle-icon]');


  if (!toggleButton || !toggleText || !toggleIcon) return;


  toggleButton.setAttribute('aria-pressed', String(isPlaying));
  toggleButton.setAttribute(
    'aria-label',
    isPlaying ? 'Pausar video' : 'Reproducir video'
  );


  toggleText.textContent = isPlaying ? 'Pausar video' : 'Reproducir video';
  toggleIcon.textContent = isPlaying ? 'Ⅱ' : '▶';
}


/**
 * Reproduce el video de una tarjeta.
 * play() devuelve una promesa; se captura el error por si el navegador
 * bloquea la reproducción automática.
 * @param {HTMLElement} card - Tarjeta del video.
 */
async function playCardVideo(card) {
  const video = card.querySelector('[data-hover-video]');
  if (!video) return;


  try {
    // El video está silenciado para permitir la reproducción automática.
    video.muted = true;
    await video.play();
    card.classList.add('is-playing');
    updateVideoButton(card, true);
  } catch (error) {
    // Si el navegador no permite reproducirlo, se conserva el estado visual.
    console.warn('No se pudo iniciar el video:', error);
    updateVideoButton(card, false);
  }
}


/**
 * Pausa el video y lo devuelve al primer fotograma.
 * @param {HTMLElement} card - Tarjeta del video.
 */
function pauseCardVideo(card) {
  const video = card.querySelector('[data-hover-video]');
  if (!video) return;


  video.pause();


  // Volver al inicio permite que el video arranque desde el principio
  // cada vez que el usuario vuelva a pasar el cursor por encima.
  try {
    video.currentTime = 0;
  } catch (error) {
    // Algunos navegadores pueden no permitir cambiar currentTime antes
    // de que los metadatos del video estén disponibles.
  }


  card.classList.remove('is-playing');
  updateVideoButton(card, false);
}


// Configuración individual de cada tarjeta de video.
videoCards.forEach((card) => {
  const video = card.querySelector('[data-hover-video]');
  const toggleButton = card.querySelector('[data-video-toggle]');


  if (!video) return;


  // Estado inicial del botón.
  updateVideoButton(card, false);


  // En computadoras: comenzar al entrar con el cursor.
  card.addEventListener('pointerenter', (event) => {
    if (hoverAvailable.matches && event.pointerType === 'mouse') {
      playCardVideo(card);
    }
  });


  // En computadoras: pausar al salir de la tarjeta.
  card.addEventListener('pointerleave', (event) => {
    if (hoverAvailable.matches && event.pointerType === 'mouse') {
      pauseCardVideo(card);
    }
  });


  // En celular/tablet: el botón permite iniciar y pausar el video con un toque.
  if (toggleButton) {
    toggleButton.addEventListener('click', () => {
      if (video.paused) {
        playCardVideo(card);
      } else {
        video.pause();
        card.classList.remove('is-playing');
        updateVideoButton(card, false);
      }
    });
  }


  // Si el video termina por alguna razón, sincroniza el control.
  video.addEventListener('pause', () => {
    if (video.currentTime > 0 && !hoverAvailable.matches) {
      card.classList.remove('is-playing');
      updateVideoButton(card, false);
    }
  });
});