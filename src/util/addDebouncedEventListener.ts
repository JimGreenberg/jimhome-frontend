export {}; // moduleize this file
interface WithAddDebouncedEventListener {
  addDebouncedEventListener: typeof addDebouncedEventListener;
}

declare global {
  interface HTMLElement extends WithAddDebouncedEventListener {}
  interface WebSocket extends WithAddDebouncedEventListener {}
}

function addDebouncedEventListener<K extends keyof WebSocketEventMap>(this: WebSocket, type: K, debounceTime: number, listener: (this: WebSocket, ev: WebSocketEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
function addDebouncedEventListener <K extends keyof HTMLElementEventMap>(this: HTMLElement, type: K, debounceTime: number, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
function addDebouncedEventListener <K>(this: any, type: K, debounceTime: number, listener: (this: any, ev: any) => any, options?: boolean | AddEventListenerOptions): void {
  let currentTimeout: ReturnType<typeof setTimeout>;
  this.addEventListener(type, (event: any) => {
    currentTimeout && window.clearTimeout(currentTimeout);
    currentTimeout = setTimeout(listener.bind(this, event), debounceTime);
  })
};

HTMLElement.prototype.addDebouncedEventListener = addDebouncedEventListener;
WebSocket.prototype.addDebouncedEventListener = addDebouncedEventListener;
