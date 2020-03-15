import parseAPNG from '../library/parser';
import './style.css';

const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = 'image/png';

document
  .getElementById('choose-btn')
  .addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', () => {
  if (fileInput.files.length > 0) {
    processFile(fileInput.files[0]);
  }
  fileInput.value = '';
});

let player = null;

document.getElementById('play-pause-btn').addEventListener('click', () => {
  if (player) {
    if (player.paused) {
      player.play();
    } else {
      player.pause();
    }
  }
});

document
  .getElementById('stop-btn')
  .addEventListener('click', () => player && player.stop());

let playbackRate = 1.0;
document.getElementById('playback-rate').addEventListener('change', e => {
  playbackRate = parseFloat(e.target.value);
  document.getElementById(
    'playback-rate-display',
  ).innerHTML = playbackRate.toString();
  if (player) {
    player.playbackRate = playbackRate;
  }
});

function processFile(file) {
  const resultBlock = document.querySelector('.apng-result');
  const errorBlock = document.querySelector('.apng-error');
  const errDiv = errorBlock.querySelector('.alert');
  const infoDiv = document.querySelector('.apng-info');
  const framesDiv = document.querySelector('.apng-frames');
  const canvasDiv = document.querySelector('.apng-ani');
  const logDiv = document.querySelector('.apng-log');

  resultBlock.classList.add('hidden');
  errorBlock.classList.add('hidden');
  emptyEl(infoDiv);
  emptyEl(framesDiv);
  emptyEl(canvasDiv);
  emptyEl(errDiv);
  emptyEl(logDiv);
  if (player) {
    player.stop();
  }

  const log = [];

  const reader = new FileReader();
  reader.onload = () => {
    const apng = parseAPNG(reader.result);
    if (apng instanceof Error) {
      errDiv.appendChild(document.createTextNode(apng.message));
      errorBlock.classList.remove('hidden');
      return;
    }
    apng.createImages().then(() => {
      infoDiv.appendChild(
        document.createTextNode(JSON.stringify(apng, null, '  ')),
      );
      apng.frames.forEach(f => {
        const div = framesDiv.appendChild(document.createElement('div'));
        div.appendChild(f.imageElement);
        div.style.width = `${apng.width}px`;
        div.style.height = `${apng.height}px`;
        f.imageElement.style.left = `${f.left}px`;
        f.imageElement.style.top = `${f.top}px`;
      });

      const canvas = document.createElement('canvas');
      canvas.width = apng.width;
      canvas.height = apng.height;
      canvasDiv.appendChild(canvas);

      apng.getPlayer(canvas.getContext('2d')).then(p => {
        player = p;
        player.playbackRate = playbackRate;
        const em = player.emit;
        player.emit = (event, ...args) => {
          log.unshift({ event, args });
          if (log.length > 10) {
            log.splice(10, log.length - 10);
          }
          logDiv.textContent = log
            .map(({ event, args }) => `${event}: ${JSON.stringify(args)}`)
            .join('\n');

          em.call(player, event, ...args);
        };
        player.play();
      });
    });
    resultBlock.classList.remove('hidden');
  };
  reader.readAsArrayBuffer(file);
}

function emptyEl(el) {
  let c;
  while ((c = el.firstChild) !== null) {
    el.removeChild(c);
  }
}
