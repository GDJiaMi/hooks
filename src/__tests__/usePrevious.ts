import { renderHook, cleanup } from "react-hooks-testing-library";
import { usePrevious } from "../index";

afterEach(cleanup);

it("test usePrevious", () => {
  const { result, rerender } = renderHook(
    (props: { prop: string }) => usePrevious(props.prop),
    {
      initialProps: { prop: "hello" }
    }
  );

  expect(result.current).toBeUndefined();

  rerender({ prop: "world" });

  expect(result.current).toBe("hello");

  rerender();

  expect(result.current).toBe("world");
});
