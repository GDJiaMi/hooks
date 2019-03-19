import { renderHook, cleanup, act } from "react-hooks-testing-library";
import { useToggle, useSideEffectState, useSession } from "../index";

beforeEach(cleanup);

it("test useToggle", () => {
  const { result } = renderHook(() => useToggle(true));

  expect(result.current[0]).toBeTruthy();

  act(() => {
    result.current[1]();
  });
  expect(result.current[0]).toBeFalsy();

  act(() => {
    result.current[1]();
  });
  expect(result.current[0]).toBeTruthy();
});

it("test useToggle with useSideEffectState", () => {
  const { result } = renderHook(() => useToggle(true, useSideEffectState));
  expect(result.current[0]).toBeTruthy();
  act(() => {
    result.current[1]();
  });
  expect(result.current[0]).toBeFalsy();
});

it("test useToggle with useSession", () => {
  const KEY = "TOGGLE";
  const { result } = renderHook(() =>
    useToggle(true, defaultValue => useSession(KEY, true, defaultValue))
  );
  expect(result.current[0]).toBeTruthy();
  expect(JSON.parse(localStorage.getItem(KEY)!)).toBeTruthy();
  act(() => {
    result.current[1]();
  });
  expect(result.current[0]).toBeFalsy();
  expect(JSON.parse(localStorage.getItem(KEY)!)).toBeFalsy();
});
