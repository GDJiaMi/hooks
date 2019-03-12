// flush all promise

const setTimeout = global.setTimeout;
export function delay() {
  return new Promise(res => {
    setTimeout(() => {
      res();
    }, 0);
  });
}

export function microDelay() {
  return new Promise(res => res());
}
