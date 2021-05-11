export declare interface PlaylistInfo {
  file?: string;
  /** ISO timestamp */
  "Last-Modified"?: string;
  Artist?: string;
  Title?: string;
  Album?: string;
  Track?: number;
  Date?: number;
  Genre?: string;
  Disc?: number;
  /* seconds */
  Time?: number;
  /* seconds */
  duration?: number;
  Pos?: number;
  Id?: number;
  Composer?: string;
  AlbumArtist?: string;
  Prio?: number;
}

/** https://www.musicpd.org/doc/html/protocol.html#status */
export declare interface Status {
  volume: number;
  repeat: boolean;
  random: boolean;
  single: boolean;
  consume: boolean;
  playlist: number;
  playlistlength: number;
  mixrampdb: number;
  state: "play" | "pause" | "stop";
  song: number;
  songid: number;
  elapsed: number;
  bitrate: number;
  duration: number;
  time: string;
  audio: string;
  nextsong: number;
  nextsongid: number;
}
