import { renderHook, cleanup, act } from "react-hooks-testing-library";
import { useSideEffectState } from "../index";

afterEach(cleanup);

describe("base useState features", () => {
  it("get initial state", () => {
    const { result } = renderHook(() => useSideEffectState(1));

    expect(result.current[0]).toEqual(1);
    expect(result.current[2]()).toEqual(1);
  });

  it("get lazy initial state", () => {
    const { result } = renderHook(() => useSideEffectState(() => 1));

    expect(result.current[0]).toEqual(1);
    expect(result.current[2]()).toEqual(1);
  });

  it("set state", () => {
    const { result } = renderHook(() => useSideEffectState(1));
    const setState = result.current[1];
    act(() => {
      setState(2);
    });
    expect(result.current[0]).toEqual(2);
    expect(result.current[2]()).toEqual(2);
  });

  it("set state by callback", () => {
    const { result } = renderHook(() => useSideEffectState(1));
    const setState = result.current[1];
    act(() => {
      setState(prev => {
        expect(prev).toEqual(1);
        return prev + 1;
      });
    });
    expect(result.current[0]).toEqual(2);
    expect(result.current[2]()).toEqual(2);
  });
});
