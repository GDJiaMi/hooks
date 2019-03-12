import { renderHook, cleanup, act } from "react-hooks-testing-library";
import { useAsyncOnMount } from "../index";
import { delay } from "./helper";

afterEach(cleanup);

const MOCK_ERROR = new Error("mockError");
const MOCK_RETURN = "HELLO";

describe("test useASyncOnMount", () => {
  it("should call fn", async () => {
    const fn = jest.fn(() => Promise.resolve());
    const {
      result: { current },
      rerender
    } = renderHook(() => useAsyncOnMount(fn));
    expect(fn).toBeCalled();

    rerender();
    expect(fn).toBeCalledTimes(1);

    // retry
    act(() => {
      current.retry();
    });

    rerender();
    expect(fn).toBeCalledTimes(2);
  });

  it("should set loading", async () => {
    act(async () => {
      const fn = jest.fn(() => Promise.reject(MOCK_ERROR));
      const {
        result: { current }
      } = renderHook(() => useAsyncOnMount(fn));
      expect(current.loading).toBeTruthy();

      await delay();
      expect(current.loading).toBeFalsy();
    });
  });

  it("should set error when fn throw", async () => {
    act(async () => {
      const fn = jest.fn(() => Promise.reject(MOCK_ERROR));
      const {
        result: { current },
        rerender
      } = renderHook(() => useAsyncOnMount(fn));

      await delay();
      expect(current.error).toBe(MOCK_ERROR);

      act(() => {
        current.retry();
      });

      rerender();
      expect(current.error).toBeNull();
    });
  });

  it("should return specified value", async () => {
    act(async () => {
      const fn = jest.fn(() => Promise.resolve(MOCK_RETURN));
      const {
        result: { current }
      } = renderHook(() => useAsyncOnMount(fn));
      await delay();
      expect(current.value).toBe(MOCK_RETURN);
    });
  });
});
