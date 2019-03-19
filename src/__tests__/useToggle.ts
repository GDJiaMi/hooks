import { renderHook, cleanup, act } from "react-hooks-testing-library";
import { useToggle } from "../index";

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
