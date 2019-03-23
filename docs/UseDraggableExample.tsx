import React from "react";
import { useDraggable } from "../src";

export const Example = () => {
  const { ref } = useDraggable<HTMLDivElement>();

  return (
    <div
      ref={ref}
      style={{ border: "1px solid gray", width: 100, height: 100 }}
    />
  );
};

export default Example;
