import React from "react";
import { useDraggable } from "../src";

export const Example = () => {
  const el = useDraggable<HTMLDivElement>();

  return (
    <div
      ref={el}
      style={{ border: "1px solid gray", width: 100, height: 100 }}
    />
  );
};

export default Example;
