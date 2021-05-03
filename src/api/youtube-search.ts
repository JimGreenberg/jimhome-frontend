import { YOUTUBE_SEARCH_URL, YOUTUBE_API_KEY } from "./constants";

export function youtubeSearch(query: string) {
  return fetch(
    `${YOUTUBE_SEARCH_URL}?part=snippet&maxResults=10&q=${query}&key=${YOUTUBE_API_KEY}&output=json`
  )
}
