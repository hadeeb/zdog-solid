import type { ConditionalPick } from 'type-fest';
import * as Zdog from 'zdog';
import type { JSXElement } from 'solid-js';
import {
  createComponent,
  createContext,
  onCleanup,
  useContext,
  splitProps,
  createEffect,
} from 'solid-js';
import { useFrame } from './use-frame';

let parentContext = createContext<Zdog.Anchor>();

type ZdogProps<T extends typeof Zdog.Anchor> = Omit<
  ConstructorParameters<T>[0],
  'addTo'
> & {
  children?: JSXElement;
};

type ZdogComponent<T extends typeof Zdog.Anchor> = (
  props: ZdogProps<T>
) => JSXElement;

let createZdog =
  <T extends typeof Zdog.Anchor>(primitive: T): ZdogComponent<T> =>
  (props) => {
    let parentElement = useContext(parentContext)!;
    let [localProps, elementProps] = splitProps(props, ['children']);
    let node = new primitive({ ...elementProps, addTo: parentElement });

    onCleanup(() => {
      parentElement.removeChild(node);
    });

    createEffect(() => {
      Object.assign(node, elementProps);
    });

    return createComponent(parentContext.Provider, {
      value: node,

      get children() {
        return localProps.children;
      },
    });
  };

let Illustration: ZdogComponent<typeof Zdog.Illustration> = (props) => {
  let [localProps, illustrationProps] = splitProps(props, [
    'element',
    'dragRotate',
    'children',
  ]);

  let illustration = new Zdog.Illustration(props);

  createEffect(() => {
    Object.assign(illustration, illustrationProps);
  });

  useFrame(() => {
    queueMicrotask(() => {
      illustration.updateRenderGraph();
    });
  });

  return createComponent(parentContext.Provider, {
    value: illustration,
    get children() {
      return localProps.children;
    },
  });
};

type ZdogClasses = ConditionalPick<typeof Zdog, typeof Zdog.Anchor>;

type ZdogComponents = {
  [P in keyof ZdogClasses]: ZdogComponent<ZdogClasses[P]>;
};

let components = { Illustration } as ZdogComponents;

let Z = new Proxy(components, {
  get(t: ZdogComponents, prop: keyof ZdogComponents) {
    if (!Object.hasOwn(t, prop) && Object.hasOwn(Zdog, prop)) {
      t[prop] = createZdog(Zdog[prop]);
    }
    return t[prop];
  },
});

export { Z };
