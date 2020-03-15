/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
import parseAPNG from '../library/parser';
import './style.css';
import Player from '../library/player';

const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = 'image/png';

function assertIsDefined<T>(val: T): asserts val is NonNullable<T> {
  if (val === undefined || val === null) {
    throw new Error(`Expected 'val' to be defined, but received ${val}`);
  }
}

function assert(val: unknown): asserts val {
  if (!val) {
    throw new Error(`Expected 'val' to be defined, but received ${val}`);
  }
}

(document.getElementById(
  'choose-btn',
) as HTMLButtonElement).addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', () => {
  assertIsDefined(fileInput.files);
  if (fileInput.files.length > 0) {
    processFile(fileInput.files[0]);
  }
  fileInput.value = '';
});

let player: Player | null = null;

(document.getElementById(
  'play-pause-btn',
) as HTMLButtonElement).addEventListener('click', () => {
  if (player) {
    if (player.paused) {
      player.play();
    } else {
      player.pause();
    }
  }
});

document
  .getElementById('stop-btn')!
  .addEventListener('click', () => player && player.stop());

let playbackRate = 1.0;
(document.getElementById('playback-rate') as HTMLInputElement).addEventListener(
  'change',
  e => {
    assert(e.target instanceof HTMLInputElement);

    playbackRate = parseFloat(e.target.value);
    (document.getElementById(
      'playback-rate-display',
    ) as HTMLSpanElement).innerHTML = playbackRate.toString();
    if (player) {
      player.playbackRate = playbackRate;
    }
  },
);

function processFile(file: File) {
  const resultBlock = document.querySelector('.apng-result') as HTMLDivElement;
  const errorBlock = document.querySelector('.apng-error') as HTMLDivElement;
  const errDiv = errorBlock.querySelector('.alert') as HTMLDivElement;
  const infoDiv = document.querySelector('.apng-info') as HTMLPreElement;
  const framesDiv = document.querySelector('.apng-frames') as HTMLParamElement;
  const canvasDiv = document.querySelector('.apng-ani') as HTMLParagraphElement;
  const logDiv = document.querySelector('.apng-log') as HTMLPreElement;

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

  const log: Array<{
    readonly event: string | symbol;
    readonly args: ReadonlyArray<unknown>;
  }> = [];

  const reader = new FileReader();
  reader.onload = () => {
    assert(reader.result instanceof ArrayBuffer);
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
        assertIsDefined(f.imageElement);
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

      apng.getPlayer(canvas.getContext('2d')!).then(p => {
        player = p;
        player.playbackRate = playbackRate;
        const em = player.emit.bind(player);
        // eslint-disable-next-line @typescript-eslint/unbound-method
        player.emit = (event: string, ...args: any[]) => {
          log.unshift({ event, args });
          if (log.length > 10) {
            log.splice(10, log.length - 10);
          }
          logDiv.textContent = log
            .map(
              ({ event, args }) => `${String(event)}: ${JSON.stringify(args)}`,
            )
            .join('\n');

          return (em as any)(event, ...args);
        };
        player.play();
      });
    });
    resultBlock.classList.remove('hidden');
  };
  reader.readAsArrayBuffer(file);
}

function emptyEl(el: HTMLElement) {
  let c: ChildNode | null;
  // eslint-disable-next-line no-cond-assign
  while ((c = el.firstChild) !== null) {
    el.removeChild(c);
  }
}
