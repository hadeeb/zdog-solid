import { onCleanup } from 'solid-js';

// https://stackoverflow.com/a/39077686/7505660
const rgbToHex = (rgb: ReturnType<typeof hexToRgb>) =>
  '#' + rgb.map((x) => Math.round(x).toString(16).padStart(2, '0')).join('');

const hexToRgb = (hex: string) =>
  hex
    .replace(
      /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
      (m, r, g, b) => '#' + r + r + g + g + b + b
    )
    .substring(1)
    .match(/.{2}/g)
    .map((x) => parseInt(x, 16));

function useInterval(handler: TimerHandler, timeout?: number) {
  const id = setInterval(handler, timeout);
  onCleanup(() => {
    clearInterval(id);
  });
}

export { rgbToHex, hexToRgb, useInterval };
