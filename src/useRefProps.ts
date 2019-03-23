import { useRef, useEffect } from "react";

export default function useRefProps<T>(props: T) {
  const ref = useRef<T>(props);

  useEffect(() => {
    ref.current = props;
  });

  return ref;
}
