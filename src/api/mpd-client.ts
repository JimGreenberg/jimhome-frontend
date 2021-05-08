import { HOSTNAME, Port } from "./constants";

const debug = false;

type Command = "status";

export class MpdClient {
  static resetTimeout = 5000;
  ws!: WebSocket;
  promiseChain!: Promise<any>;
  count = 0;
  resetTimeout?: ReturnType<typeof setTimeout>;

  constructor() {
    this.reset();
  }

  send(command: Command): Promise<string | void> {
    this.resetTimeout && clearTimeout(this.resetTimeout)
    this.resetTimeout = setTimeout(this.resetPromiseChain.bind(this), MpdClient.resetTimeout);
    this.promiseChain = this.promiseChain.then(() => {
      return new Promise((resolve) => {
        this.ws.send(command);
        const handler = ({ data }: MessageEvent) => {
          resolve(data);
          this.ws.removeEventListener("message", handler);
        };
        this.ws.addEventListener("message", handler);
      });
    });
    return this.promiseChain;
  }

  private resetPromiseChain() {
    this.resetTimeout = undefined;
    this.promiseChain = Promise.resolve().catch(this.reset.bind(this));
  }

  private reset() {
    this.ws = new WebSocket(`ws://${HOSTNAME}:${Port.MPD_PROXY}/`); // NOT wss, we can't have nice things
    debug &&
      this.ws.addEventListener("message", ({ data }) => console.error(data));
    this.resetPromiseChain()
  }
}
