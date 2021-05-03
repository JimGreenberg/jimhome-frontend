import { HOSTNAME, Port } from "./constants";

export function postYouTubeUrlToNuc(url: string) {
  const body = new FormData();
  body.set("youtube-uri", url);
  return fetch(`http://${HOSTNAME}:${Port.YOUTUBE_URI}`, { method: "POST", mode: "no-cors", body });
}
