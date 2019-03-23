import React from "react";
import { useDraggable } from "../src";

export const Example = () => {
  const { ref } = useDraggable<HTMLDivElement>({
    bounds: "parent",
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

export default Example;
