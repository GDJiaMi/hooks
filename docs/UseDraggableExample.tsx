import React from "react";
import { useSpring, animated } from "react-spring";
import { useDraggable } from "../src";
import { clamp } from "../src/utils";

export const Example = () => {
  const { ref } = useDraggable<HTMLDivElement>({
    bounds: "parent",
    edge: true,
    defaultTranslate: { x: 10, y: 10 }
  });

  return (
    <div style={{ border: "1px solid red", width: 500, height: 500 }}>
      <div
        ref={ref}
        style={{
          border: "1px solid gray",
          width: 100,
          height: 100,
          background: "cyan"
        }}
      />
    </div>
  );
};

export const SpringExample = () => {
  const [{ translate }, set] = useSpring(() => ({ translate: [0, 0] }));
  const { ref } = useDraggable({
    disableTransform: true,
    bounds: "parent",
    onMove: (pos, off) => {
      const velocity = clamp(pos.velocity, 1, 8);
      set({
        translate: [off.x, off.y],
        config: { mass: 1, tension: 500 * velocity, friction: 50, clamp: true }
      });
    },
    onUp: (pos, off) => {
      set({ translate: [off.x, off.y] });
    }
  });

  return (
    <div style={{ border: "1px solid red", width: 500, height: 500 }}>
      <animated.div
        ref={ref}
        style={{
          width: 100,
          height: 100,
          border: "1px solid gray",
          transform: translate.interpolate(
            (x, y) => `translate3d(${x}px,${y}px,0)`
          )
        }}
      />
    </div>
  );
};

export default Example;
