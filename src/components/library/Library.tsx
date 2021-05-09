import React from "react";
import { MpdClient } from "../../api/mpd-client";
import List from "../list/List";
import Breadcrumbs from "../breadcrumbs/Breadcrumbs";
import "./Library.scss";

const fake: Record<string, Record<string, string[]>> = {
  artist1: {
    album1: [
      "Despair in the departure lounge",
      "song2",
      "song3",
      "song4",
      "sosrsng5",
      "sodng1",
      "sondg2",
      "songd3",
      "song4s",
      "songes5",
      "songafse1",
      "songs2",
      "soesfng3",
      "sonseg4",
      "soneefsg5",
      "sonsefg1",
      "songsef2",
      "sseong3",
      "songe4",
      "soneg5",
      "songe1",
      "soneg2",
      "sonfeg3",
      "sonfeg4",
      "sonfeg5",
    ],
    album2: ["song1", "song2", "song3", "song4", "song5"],
    album3: ["song1", "song2", "song3", "song4", "song5"],
    album4: ["song1", "song2", "song3", "song4", "song5"],
    album5: ["song1", "song2", "song3", "song4", "song5"],
  },
  artist2: {
    album1: ["song1", "song2", "song3", "song4", "song5"],
    album2: ["song1", "song2", "song3", "song4", "song5"],
    album3: ["song1", "song2", "song3", "song4", "song5"],
    album4: ["song1", "song2", "song3", "song4", "song5"],
    album5: ["song1", "song2", "song3", "song4", "song5"],
  },
  artist3: {
    album1: ["song1", "song2", "song3", "song4", "song5"],
    album2: ["song1", "song2", "song3", "song4", "song5"],
    album3: ["song1", "song2", "song3", "song4", "song5"],
    album4: ["song1", "song2", "song3", "song4", "song5"],
    album5: ["song1", "song2", "song3", "song4", "song5"],
  },
  artist4: {
    album1: ["song1", "song2", "song3", "song4", "song5"],
    album2: ["song1", "song2", "song3", "song4", "song5"],
    album3: ["song1", "song2", "song3", "song4", "song5"],
    album4: ["song1", "song2", "song3", "song4", "song5"],
    album5: ["song1", "song2", "song3", "song4", "song5"],
  },
};

export default function Library() {
  const [artist, setArtist] = React.useState<string | undefined>();
  const [album, setAlbum] = React.useState<string | undefined>();

  function playSong(song: string) {
    // MpdClient.send(song);
  }

  function onLabelClick(i: number) {
    if (i < 1) setArtist(undefined);
    if (i < 2) setAlbum(undefined);
  }

  return (
    <>
      <Breadcrumbs labels={["All", artist, album].filter((label): label is string => !!label)} onLabelClick={onLabelClick}/>
      <h1>{album ? album : artist ? artist : "Artists"}</h1>
      {!artist && !album ? (
        <List>
          {Object.keys(fake).map((_artist) => (
            <button key={_artist} onClick={() => setArtist(_artist)}>
              {_artist}
            </button>
          ))}
        </List>
      ) : undefined}
      {artist && !album ? (
        <List>
          {Object.keys(fake[artist]).map((_album) => (
            <button key={_album} onClick={() => setAlbum(_album)}>
              {_album}
            </button>
          ))}
        </List>
      ) : undefined}
      {artist && album ? (
        <List>
          {fake[artist][album].map((song) => (
            <button key={song} onClick={() => playSong(song)}>
              {song}
            </button>
          ))}
        </List>
      ) : undefined}
    </>
  );
}
