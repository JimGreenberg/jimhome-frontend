import React from "react";
import { MpdClient } from "../../api/mpd-client";
import List from "../list/List";
import Breadcrumbs from "../breadcrumbs/Breadcrumbs";
import "./Library.scss";

const fake: Record<string, Record<string, string[]>> = {
  artist1: {
    ablum1: ["Despair in the departure lounge", "song2", "song3", "song4", "song5"],
    ablum2: ["song1", "song2", "song3", "song4", "song5"],
    ablum3: ["song1", "song2", "song3", "song4", "song5"],
    ablum4: ["song1", "song2", "song3", "song4", "song5"],
    ablum5: ["song1", "song2", "song3", "song4", "song5"],
  },
  artist2: {
    ablum1: ["song1", "song2", "song3", "song4", "song5"],
    ablum2: ["song1", "song2", "song3", "song4", "song5"],
    ablum3: ["song1", "song2", "song3", "song4", "song5"],
    ablum4: ["song1", "song2", "song3", "song4", "song5"],
    ablum5: ["song1", "song2", "song3", "song4", "song5"],
  },
  artist3: {
    ablum1: ["song1", "song2", "song3", "song4", "song5"],
    ablum2: ["song1", "song2", "song3", "song4", "song5"],
    ablum3: ["song1", "song2", "song3", "song4", "song5"],
    ablum4: ["song1", "song2", "song3", "song4", "song5"],
    ablum5: ["song1", "song2", "song3", "song4", "song5"],
  },
  artist4: {
    ablum1: ["song1", "song2", "song3", "song4", "song5"],
    ablum2: ["song1", "song2", "song3", "song4", "song5"],
    ablum3: ["song1", "song2", "song3", "song4", "song5"],
    ablum4: ["song1", "song2", "song3", "song4", "song5"],
    ablum5: ["song1", "song2", "song3", "song4", "song5"],
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
      {/* <div className="breadcrumbs">
        {artist ? (
          <a
            onClick={() => {
              setAlbum(undefined);
            }}
          >
            {artist}
          </a>
        ) : undefined}
        {album ? (
          <>
            <span className="arrow">&gt;</span>
            <a
              onClick={() => {
                setAlbum(undefined);
              }}
            >
              {album}
            </a>
          </>
        ) : undefined}
      </div> */}
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
