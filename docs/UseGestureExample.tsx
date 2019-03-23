import React from "react";
import { useGesture } from "../src";

export const Example = () => {
  const el = useGesture({
    onDown: pos => {
      console.log("down", pos);
    },
    onMove: pos => {
      console.log("move", pos);
    },
    onUp: pos => {
      console.log("up", pos);
    }
  });

  return (
    <div
      ref={el}
      style={{ border: "1px solid gray", width: 100, height: 100 }}
    />
  );
};

export default Example;
