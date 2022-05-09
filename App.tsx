import { createSignal, Accessor } from 'solid-js';
import { TAU } from 'zdog';

import { Z } from './solid-zdog';
import { useFrame } from './use-frame';
import { useSpring } from './use-spring';
import { hexToRgb, rgbToHex, useInterval } from './utils';
const { Ellipse, Illustration, Shape, Anchor, RoundedRect } = Z;

const interpolate = <T, U>(x: Accessor<T>, cb: (x: T) => U) => cb(x());

type Props<T> = T extends (x: infer P) => any ? P : unknown;

const Eye = (props: Props<typeof Ellipse>) => (
  <Ellipse
    diameter={1.5}
    quarters={2}
    translate={{ x: -2.2, y: 0, z: 4.5 }}
    rotate={{ z: -TAU / 4 }}
    color="#444B6E"
    stroke={0.5}
    {...props}
  />
);
const Leg = (props: Props<typeof Shape>) => (
  <Shape
    path={[{ y: 0 }, { y: 6 }]}
    translate={{ x: -3 }}
    color="#747B9E"
    stroke={4}
    {...props}
  >
    <Shape
      path={[{ y: 0 }, { y: 6 }]}
      translate={{ y: 6 }}
      rotate={{ x: -TAU / 8 }}
      color="#747B9E"
      stroke={4}
    />
    <RoundedRect
      width={2}
      height={4}
      cornerRadius={1}
      translate={{ y: 12, z: -3.5 }}
      rotate={{ x: TAU / 6 }}
      color="#444B6E"
      fill
      stroke={4}
    />
  </Shape>
);
const Arm = (props: Props<typeof Shape>) => (
  <Shape
    path={[{ y: 0 }, { y: 4 }]}
    translate={{ x: -5, y: -2 }}
    color="#F0F2EF"
    stroke={4}
    {...props}
  >
    <Shape
      path={[{ y: 0 }, { y: 4 }]}
      translate={{ y: 6 }}
      rotate={{ x: TAU / 8 }}
      color="#EA0"
      stroke={4}
    />
    <Shape translate={{ z: 4, y: 9, x: 0 }} stroke={5.4} color="#EA0" />
  </Shape>
);

function Guy() {
  const [up, setUp] = createSignal(true);
  useInterval(() => setUp((previous) => !previous), 450);

  const size = useSpring(() => (up() ? 1.2 : 0.2));
  const rotation = useSpring(() => (up() ? 0 : TAU / 2));
  const colors = useSpring(() => hexToRgb(up() ? '#EA0' : '#FF6347'));

  const [t, setT] = createSignal(0);

  useFrame(() => {
    setT((t) => t + 0.1);
  });

  return (
    <Shape
      rotate={{ y: Math.cos((t() + 0.1) / TAU) }}
      path={[{ x: -3 }, { x: 3 }]}
      stroke={4}
      color="#747B9E"
    >
      <Anchor rotate={interpolate(rotation, (r) => ({ x: TAU / 18 + -r / 4 }))}>
        <Shape
          path={[{ x: -1.5 }, { x: 1.5 }]}
          translate={{ y: -6 }}
          stroke={9}
          color="#E1E5EE"
        >
          <Shape
            stroke={11}
            translate={{ y: -9.5 }}
            color={interpolate(colors, rgbToHex)}
          >
            <Shape
              translate={{ x: 0, y: -2, z: -4 }}
              stroke={8}
              color="#747B9E"
            />
            <Ellipse
              diameter={6}
              rotate={{ x: -TAU / 10 }}
              translate={{ y: -4, z: -1 }}
              stroke={4}
              color="#444B6E"
              fill
            />
            <Eye />
            <Eye translate={{ x: 2.2, z: 4.5 }} />
            <Ellipse
              diameter={1.3}
              scale={size()}
              translate={{ y: 2, z: 4.5 }}
              rotate={{ z: TAU / 4 }}
              closed
              color="#444B6E"
              stroke={0.5}
              fill
            />
            <Ellipse
              diameter={1}
              translate={{ x: -3.5, y: 1.5, z: 4.5 }}
              rotate={{ z: TAU / 4 }}
              closed
              color="indianred"
              stroke={0.5}
              fill
            />
            <Ellipse
              diameter={1}
              translate={{ x: 3.5, y: 1.5, z: 4.5 }}
              rotate={{ z: TAU / 4 }}
              closed
              color="indianred"
              stroke={0.5}
              fill
            />
            <Ellipse
              diameter={0.5}
              translate={{ x: 4.5, y: -4.5, z: 4.5 }}
              rotate={{ z: TAU / 4 }}
              closed
              color="lightblue"
              stroke={0.5}
              fill
            />
          </Shape>
          <Arm rotate={interpolate(rotation, (r) => ({ x: -TAU / 4 + r }))} />
          <Arm
            translate={{ x: 5, y: -2 }}
            rotate={interpolate(rotation, (r) => ({ x: TAU / 4 - r }))}
          />
        </Shape>
      </Anchor>
      <Leg rotate={interpolate(rotation, (r) => ({ x: TAU / 5 - r / 1.2 }))} />
      <Leg
        translate={{ x: 3 }}
        rotate={interpolate(rotation, (r) => ({ x: -TAU / 5 + r / 1.2 }))}
      />
    </Shape>
  );
}

function App() {
  // let canvas: HTMLCanvasElement;
  return [
    // <canvas ref={canvas} class="solid-zdog" width={500} height={500} />,
    // <Illustration zoom={8} element={canvas}>
    <Illustration zoom={8} element=".zdog">
      <Ellipse
        diameter={20}
        rotate={{ x: -TAU / 3 }}
        translate={{ y: 15, z: -100 }}
        stroke={4}
        color="#373740"
        fill
      />
      <Guy />
    </Illustration>,
  ];
}

export default App;
