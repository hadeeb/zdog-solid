import { loop } from 'svelte/internal';
import { onCleanup } from 'solid-js';

let useFrame = (cb: VoidFunction) => {
  onCleanup(loop(() => (cb(), true)).abort);
};

export { useFrame };
