export {}; // moduleize this file

function addDebouncedEventListener <K extends keyof HTMLElementEventMap>(this: HTMLElement, type: K, debounceTime: number, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void {
  let currentTimeout: ReturnType<typeof setTimeout>;
  this.addEventListener(type, event => {
    currentTimeout && window.clearTimeout(currentTimeout);
    currentTimeout = setTimeout(listener.bind(this, event), debounceTime);
  })
};

declare global {
  interface HTMLElement {
    addDebouncedEventListener: typeof addDebouncedEventListener;
  }
}

HTMLElement.prototype.addDebouncedEventListener = addDebouncedEventListener;
