import { Accessor, createSignal, onCleanup, createEffect } from 'solid-js';
import { spring } from 'svelte/motion';
import type { Subscriber } from 'svelte/store';

type SpringOpts = Parameters<typeof spring>;

function useSpring<T extends number | readonly number[]>(
  getValue: Accessor<T>,
  opts?: Accessor<SpringOpts[1]>
) {
  const initialValue = getValue();
  const [value, setValue] = createSignal(initialValue);
  const springInst = spring(initialValue, opts?.());

  onCleanup(springInst.subscribe(setValue as Subscriber<T>));

  createEffect(() => {
    Object.assign(springInst, opts?.());
  });

  createEffect(() => {
    springInst.set(getValue());
  });
  return value;
}

export { useSpring };
