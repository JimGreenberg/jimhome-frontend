import { HOSTNAME, Port } from "./constants";
import { PlaylistInfo } from "./playlist-info";

type KeysWithValsOfType<T, V> = keyof {
  [P in keyof T as T[P] extends V ? P : never]: P;
};

const debug = false;

export class MpdClient {
  static _resetTimeout = 5000;
  static resetTimeout?: ReturnType<typeof setTimeout>;
  static ws?: WebSocket;
  static promiseChain: Promise<any>;

  private constructor() {}

  static connect() {
    MpdClient.ws && MpdClient.ws.close();
    MpdClient.ws = new WebSocket(`ws://${HOSTNAME}:${Port.MPD_PROXY}/`); // NOT wss, we can't have nice things
    debug &&
      MpdClient.ws.addEventListener("message", ({ data }) => console.error(data));
    MpdClient.resetPromiseChain()
  }

  static listArtists(): Promise<string[]> {
    return MpdClient.send("list artist").then((response) => {
      if (!response) throw new Error("no response");
      const list = response
        .split("\n")
        .map((album) => album.replace(/^Artist: /, ""));
      return list;
    });
  }

  static listAlbums(artist: string): Promise<string[]> {
    return MpdClient.send(`list album ${MpdClient.buildQuery("artist", "==", artist)}`).then((response) => {
      if (!response) throw new Error("no response");
      const list = response
        .split("\n")
        .map((album) => album.replace(/^Album: /, ""));
      return list;
    });
  }

  static listTitles(album: string): Promise<string[]> {
    return MpdClient.send(`list title ${MpdClient.buildQuery("album", "==", album)}`).then((response) => {
      if (!response) throw new Error("no response");
      const list = response
        .split("\n")
        .map((album) => album.replace(/^Title: /, ""));
      return list;
    });
  }

  static addSong(title: string): Promise<void> {
    return MpdClient.send(`findadd ${MpdClient.buildQuery("title", "==", title)}`).then();
  }

  static addAlbum(album: string): Promise<void> {
    return MpdClient.send(`findadd ${MpdClient.buildQuery("album", "==", album)}`).then();
  }

  static addArtist(artist: string): Promise<void> {
    return MpdClient.send(`findadd ${MpdClient.buildQuery("artist", "==", artist)}`).then();
  }

  static play(): Promise<void> {
    return MpdClient.send("play").then();
  }

  static pause(): Promise<void> {
    return MpdClient.send("pause").then();
  }

  static next(): Promise<void> {
    return MpdClient.send("next").then();
  }

  static shuffle(doShuffle: boolean): Promise<void> {
    return MpdClient.send(`random ${doShuffle ? 1 : 0}`).then();
  }

  static setVol(volume: number): Promise<void> {
    return MpdClient.send(`setvol ${volume}`).then();
  }

  static clear(): Promise<void> {
    return MpdClient.send("clear").then();
  }

  static getQueue(): Promise<PlaylistInfo[]> {
    return MpdClient.send("playlistinfo").then(response => {
      const arr = new Array<PlaylistInfo>();
      let i = 0;
      response.split("\n").forEach(line => {
        // eslint-disable-next-line  @typescript-eslint/no-unused-vars
        const [_, key, value] = (/(^[\w-]*):\s(.*)\n?$/.exec(line) as unknown) as [never, keyof PlaylistInfo, string, ...never[]];
        if (!arr[i]) arr[i] = {} as PlaylistInfo; // init the object
        if (!!arr[i][key]) i++; // defensive coding, if we're trying to overwrite something it means we didn't successfully increment
        const isNumberKey = [
          "Date",
          "Disc",
          "Time",
          "duration",
          "Pos",
          "Id",
          "Prio",
        ].includes(key);
        if (
          ((
            _key: string
          ): _key is KeysWithValsOfType<Required<PlaylistInfo>, number> =>
            isNumberKey)(key)
        ) {
          arr[i][key] = parseInt(value);
        } else {
          arr[i][key] = value;
        }
        if (key === "Id") i++; // we hope Id is the last key, and that Id exists on every item
      });
      return arr;
    });
  }

  static send(command: string): Promise<string> {
    MpdClient.resetTimeout && clearTimeout(MpdClient.resetTimeout)
    MpdClient.resetTimeout = setTimeout(MpdClient.resetPromiseChain.bind(MpdClient), MpdClient._resetTimeout);
    MpdClient.promiseChain = MpdClient.promiseChain.then(() => {
      return new Promise(resolve => {
        debug && console.error(command);
        MpdClient.ws?.send(command);
        const handler = ({ data }: MessageEvent) => {
          resolve(data.replace(/\nOK\n$/m, ""));
          MpdClient.ws?.removeEventListener("message", handler);
        };
        MpdClient.ws?.addEventListener("message", handler);
      });
    });
    return MpdClient.promiseChain;
  }

  private static buildQuery(tag: string, compare: string, value: string, group?: string): string {
    const query = `"(${tag} ${compare} '${value.replace(/(["])/g, "\\"+"$1")}')"`; // eslint-disable-line no-useless-escape
    return group ? query + " group " + group : query;
  }

  private static resetPromiseChain() {
    MpdClient.resetTimeout = undefined;
    MpdClient.promiseChain = Promise.resolve().catch(MpdClient.connect.bind(MpdClient));
  }

}
