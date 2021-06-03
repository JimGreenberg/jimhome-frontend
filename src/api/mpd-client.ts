import { HOSTNAME, Port } from "./constants";
import { PlaylistInfo, Status } from "./mpd";

type KeysInOfType<T, V> = keyof {
  [P in keyof T as T[P] extends V ? P : never]: P;
};

const debug = false;

export class MpdClient {
  static _resetTimeoutLength = 5000;
  static resetTimeout?: ReturnType<typeof setTimeout>;
  static ws?: WebSocket;
  static promiseChain: Promise<any>;

  private constructor() {}

  static connect() {
    MpdClient.ws && MpdClient.ws.close();
    MpdClient.ws = new WebSocket(`ws://${HOSTNAME}:${Port.MPD_PROXY}/`); // NOT wss, we can't have nice things
    MpdClient.promiseChain = new Promise<void>(resolve => MpdClient.ws!.addEventListener("open", () => {
      setTimeout(() => resolve(), 100);
    }));
    debug && MpdClient.ws.addEventListener("message", ({ data }) => console.error(data));
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

  static addSong(title: string): Promise<PlaylistInfo[]> {
    let prev;
    return MpdClient.getQueue().then(queue => {
      prev = queue;
      return MpdClient.send(`findadd ${MpdClient.buildQuery("title", "==", title)}`);
    })
    .then(MpdClient.getQueue)
    .then(queue => queue.slice(prev.length));
  }

  static addAlbum(album: string): Promise<PlaylistInfo[]> {
    let prev;
    return MpdClient.getQueue().then(queue => {
      prev = queue;
      return MpdClient.send(`findadd ${MpdClient.buildQuery("album", "==", album)}`);
    })
    .then(MpdClient.getQueue)
    .then(queue => queue.slice(prev.length));
  }

  static addArtist(artist: string): Promise<PlaylistInfo[]> {
    let prev;
    return MpdClient.getQueue().then(queue => {
      prev = queue;
      return MpdClient.send(`findadd ${MpdClient.buildQuery("artist", "==", artist)}`);
    })
    .then(MpdClient.getQueue)
    .then(queue => queue.slice(prev.length));
  }

  static play(): Promise<void> {
    return MpdClient.send("play").then();
  }

  static pause(): Promise<void> {
    return MpdClient.send("pause").then();
  }

  static stop(): Promise<void> {
    return MpdClient.send("stop").then();
  }

  static next(): Promise<void> {
    return MpdClient.send("next").then();
  }

  static previous(): Promise<void> {
    return MpdClient.send("previous").then();
  }

  static shuffle(start: number, end = 99): Promise<void> {
    return MpdClient.send(`shuffle ${start}:${end}`).then();
  }

  static setVol(volume: number): Promise<void> {
    return MpdClient.send(`setvol ${volume}`).then();
  }

  static clear(): Promise<void> {
    return MpdClient.send("clear").then();
  }

  static status(): Promise<Status> {
    return MpdClient.send("status").then(response => {
      const status = {} as Status;
      response.split("\n").forEach(line => {
        // eslint-disable-next-line  @typescript-eslint/no-unused-vars
        const [_, key, value] = (/(^[\w-]*):\s(.*)\n?$/.exec(line) as unknown) as [never, keyof Status, string, ...never[]];
        const isBooleanKey = ["repeat", "random", "single", "consume"].includes(key);
        const isStringKey = ["time", "audio", "state"].includes(key);
        if (
          ((
            _key: string
          ): _key is KeysInOfType<Required<Status>, boolean> =>
            isBooleanKey)(key)
        ) {
          status[key] = !!value;
        } else if (
          ((
            _key: string
          ): _key is KeysInOfType<Required<Status>, string> =>
            isStringKey)(key)
        ) {
          status[key] = value as "play"; // just make it stop complaining
        } else {
          status[key] = parseInt(value);
        }
      });
      return status;
    });
  }

  /** kinda private */
  static playlistInfo(start: number, end?: number): Promise<PlaylistInfo[]> {
    return MpdClient.send(`playlistinfo ${start}:${end}`).then(response => {
      const arr = new Array<PlaylistInfo>();
      if (!response) return arr;
      let i = 0;
      response.split("\n").forEach(line => {
        const execResult = (/(^[\w-]*):\s(.*)\n?$/.exec(line) as unknown);
        if (!execResult) {
          throw line;
        }
        const [_, key, value] = execResult as [never, keyof PlaylistInfo, string, ...never[]];
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
        if (((_key: string): _key is KeysInOfType<Required<PlaylistInfo>, number> => isNumberKey)(key)) {
          arr[i][key] = parseInt(value);
        } else {
          arr[i][key] = value;
        }
        if (key === "Id") i++; // we hope Id is the last key, and that Id exists on every item
      });
      return arr;
    });
  }

  static getQueue(): Promise<PlaylistInfo[]> {
    const CHUNK_SIZE = 50;
    function playlistInfoRecursive(dataPointer: number): Promise<PlaylistInfo[]> {
      return MpdClient.playlistInfo(dataPointer, dataPointer + CHUNK_SIZE).then(arr => {
        if (arr.length < CHUNK_SIZE) {
          return Promise.resolve(arr);
        } else {
          return playlistInfoRecursive(dataPointer + CHUNK_SIZE).then(newArr => arr.concat(newArr));
        }
      });
    }

    return playlistInfoRecursive(0);
  }

  static getCurrentSong(): Promise<[PlaylistInfo]> {
    return MpdClient.playlistInfo(0) as Promise<[PlaylistInfo]>;
  }

  static send(command: string): Promise<string> {
    MpdClient.resetTimeout && clearTimeout(MpdClient.resetTimeout)
    MpdClient.resetTimeout = setTimeout(MpdClient.resetPromiseChain.bind(MpdClient), MpdClient._resetTimeoutLength);
    MpdClient.promiseChain = MpdClient.promiseChain.then(() => {
      return new Promise(resolve => {
        debug && console.error(command);
        MpdClient.ws?.send(command);
        const handler = ({ data }: MessageEvent) => {
          resolve(data.replace(/\n?OK\n$/m, ""));
          MpdClient.ws?.removeEventListener("message", handler);
        };
        MpdClient.ws?.addEventListener("message", handler);
      });
    });
    return MpdClient.promiseChain;
  }

  private static buildQuery(tag: string, compare: string, value: string, group?: string): string {
    const query = `"(${tag} ${compare} '${value.replace(/(["])/g, "\\"+"$1")}')"`; // eslint-disable-line no-useless-escape, no-useless-concat
    return group ? query + " group " + group : query;
  }

  private static resetPromiseChain() {
    MpdClient.resetTimeout = undefined;
    if (MpdClient.ws?.readyState === WebSocket.OPEN) {
      MpdClient.promiseChain = Promise.resolve().catch(MpdClient.connect.bind(MpdClient));
    } else {
      MpdClient.connect();
    }
  }

}
