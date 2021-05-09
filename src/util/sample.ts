export {}; // moduleize this file

function sample<T>(arr: Array<T>): T {
  return arr[Math.floor(Math.random() * arr.length - 1)];
}

declare global {
  interface Array<T> {
    sample: typeof sample;
  }
}

Array.prototype.sample = sample;
