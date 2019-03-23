import { isMouseEvent, extraPosition } from "../utils";

it("test isMouseEvent", () => {
  expect(isMouseEvent(new MouseEvent("mousedown"))).toBeTruthy();
  expect(isMouseEvent(new MouseEvent("no-mouse"))).toBeFalsy();
  expect(isMouseEvent(new TouchEvent("touchstart"))).toBeFalsy();
});

it("test extraPosition", () => {
  const mouseEvent = new MouseEvent("mousedown", { clientX: 10, clientY: 20 });
  expect(extraPosition(mouseEvent)).toEqual({ x: 10, y: 20 });

  const target: any = {};
  const touchEvent = new TouchEvent("touchstart", {
    targetTouches: [
      {
        target,
        identifier: 0,
        pageX: 10,
        pageY: 20
      } as Touch
    ]
  });

  expect(extraPosition(touchEvent)).toEqual({ x: 10, y: 20, id: 0 });

  const touchMoveEvent = new TouchEvent("touchstart", {
    touches: [
      {
        target,
        identifier: 0,
        pageX: 10,
        pageY: 20
      } as Touch,
      {
        target,
        identifier: 2,
        pageX: 30,
        pageY: 27
      } as Touch
    ]
  });

  expect(extraPosition(touchMoveEvent, 1)).toBeFalsy();
  expect(extraPosition(touchMoveEvent, 2)).toEqual({ x: 30, y: 27, id: 2 });
});
