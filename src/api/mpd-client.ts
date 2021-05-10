import { HOSTNAME, Port } from "./constants";

const debug = false;

type Command = "status" | string;

export class MpdClient {
  static _resetTimeout = 5000;
  static resetTimeout?: ReturnType<typeof setTimeout>;
  static ws?: WebSocket;
  static promiseChain: Promise<any>;

  private constructor() {}

  static connect () {
    MpdClient.ws && MpdClient.ws.close();
    MpdClient.ws = new WebSocket(`ws://${HOSTNAME}:${Port.MPD_PROXY}/`); // NOT wss, we can't have nice things
    debug &&
      MpdClient.ws.addEventListener("message", ({ data }) => console.error(data));
    MpdClient.resetPromiseChain()
  }

  static send(command: Command): Promise<string | void> {
    MpdClient.resetTimeout && clearTimeout(MpdClient.resetTimeout)
    MpdClient.resetTimeout = setTimeout(MpdClient.resetPromiseChain.bind(MpdClient), MpdClient._resetTimeout);
    MpdClient.promiseChain = MpdClient.promiseChain.then(() => {
      return new Promise((resolve, reject) => {
        MpdClient.ws?.send(command);
        const handler = ({ data }: MessageEvent) => {
          resolve(data);
          MpdClient.ws?.removeEventListener("message", handler);
        };
        MpdClient.ws?.addEventListener("message", handler);
      });
    });
    return MpdClient.promiseChain;
  }

  private static resetPromiseChain() {
    MpdClient.resetTimeout = undefined;
    MpdClient.promiseChain = Promise.resolve().catch(MpdClient.connect.bind(MpdClient));
  }

}
