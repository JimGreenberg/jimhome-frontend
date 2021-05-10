import React, { useEffect } from "react";
import { MpdClient } from "../../api/mpd-client";
import List from "../list/List";
import Breadcrumbs from "../breadcrumbs/Breadcrumbs";
import "./Library.scss";

// const fake: Record<string, Record<string, string[]>> = {
//   artist1: {
//     album1: [
//       "Despair in the departure lounge",
//       "song2",
//       "song3",
//       "song4",
//       "sosrsng5",
//       "sodng1",
//       "sondg2",
//       "songd3",
//       "song4s",
//       "songes5",
//       "songafse1",
//       "songs2",
//       "soesfng3",
//       "sonseg4",
//       "soneefsg5",
//       "sonsefg1",
//       "songsef2",
//       "sseong3",
//       "songe4",
//       "soneg5",
//       "songe1",
//       "soneg2",
//       "sonfeg3",
//       "sonfeg4",
//       "sonfeg5",
//     ],
//     album2: ["song1", "song2", "song3", "song4", "song5"],
//     album3: ["song1", "song2", "song3", "song4", "song5"],
//     album4: ["song1", "song2", "song3", "song4", "song5"],
//     album5: ["song1", "song2", "song3", "song4", "song5"],
//   },
//   artist2: {
//     album1: ["song1", "song2", "song3", "song4", "song5"],
//     album2: ["song1", "song2", "song3", "song4", "song5"],
//     album3: ["song1", "song2", "song3", "song4", "song5"],
//     album4: ["song1", "song2", "song3", "song4", "song5"],
//     album5: ["song1", "song2", "song3", "song4", "song5"],
//   },
//   artist3: {
//     album1: ["song1", "song2", "song3", "song4", "song5"],
//     album2: ["song1", "song2", "song3", "song4", "song5"],
//     album3: ["song1", "song2", "song3", "song4", "song5"],
//     album4: ["song1", "song2", "song3", "song4", "song5"],
//     album5: ["song1", "song2", "song3", "song4", "song5"],
//   },
//   artist4: {
//     album1: ["song1", "song2", "song3", "song4", "song5"],
//     album2: ["song1", "song2", "song3", "song4", "song5"],
//     album3: ["song1", "song2", "song3", "song4", "song5"],
//     album4: ["song1", "song2", "song3", "song4", "song5"],
//     album5: ["song1", "song2", "song3", "song4", "song5"],
//   },
// };

export default function Library() {
  const [listState, setListState] = React.useState<Array<string>>([]);
  const [selectedArtist, setSelectedArtist] = React.useState<string | undefined>();
  const [selectedAlbum, setSelectedAlbum] = React.useState<string | undefined>();

  useEffect(() => {
    console.error("list artist");
    listArtists();
  }, []);

  function onLabelClick(i: number) {
    if (i < 1) {
      setSelectedArtist(undefined);
      setSelectedAlbum(undefined);
      listArtists();
    } else if (i < 2) {
      setSelectedAlbum(undefined);
      listAlbums(selectedArtist as string);
    }
  }

  function onListItemClick(item: string): void {
    if (!selectedArtist) {
      const artist = item.replace(/^Artist: /, "");
      console.error(artist)
      setSelectedArtist(artist);
      listAlbums(artist);
    } else if (selectedArtist && !selectedAlbum) {
      const album = item.replace(/^Album: /, "");
      setSelectedAlbum(item);
      listSongs(album);
    } else if (selectedArtist && selectedAlbum) {
      // play song
      console.error(item);
    } else {
      console.error("illegal");
    }
  }

  function listArtists(): void {
    MpdClient.send("list artist").then((response) => {
      if (!response) return;
      const artists = response
        .split("\n")
        .map((album) => album.replace(/^Artist: /, ""));
      artists.pop();
      artists.pop();
      setListState(artists);
    });
  }

  function listAlbums(artist: string): void {
    MpdClient.send(`list album "(artist == '${artist}')"`).then(
      (response) => {
        if (!response) return;
        const albums = response
          .split("\n")
          .map((album) => album.replace(/^Album: /, ""));
        console.error(albums);
        albums.pop();
        albums.pop();
        setListState(albums);
      }
    );
  }

  function listSongs(album: string): void {
    MpdClient.send(`list title "(album == '${album}')"`).then((response) => {
      if (!response) return;
      const songs = response
        .split("\n")
        .map((album) => album.replace(/^Title: /, ""));
      console.error(songs);
      songs.pop();
      songs.pop();
      setListState(songs);
    });
  }

  return (
    <>
      <Breadcrumbs labels={["All", selectedArtist, selectedAlbum].filter((label): label is string => !!label)} onLabelClick={onLabelClick}/>
      <h1>{selectedAlbum ? selectedAlbum : selectedArtist ? selectedArtist : "Artists"}</h1>
      {/* {!selectedArtist && !selectedAlbum ? ( */}
        <List>
          {listState.map((_item) => (
            <button key={_item} onClick={() => onListItemClick(_item)}>
              {_item}
            </button>
          ))}
        </List>
      {/* ) : undefined}   */}
      {/* {selectedArtist && !selectedAlbum ? (
        <List>
          {Object.keys(fake[selectedArtist]).map((_album) => (
            <button key={_album} onClick={() => setSelectedAlbum(_album)}>
              {_album}
            </button>
          ))}
        </List>
      ) : undefined}
      {selectedArtist && selectedAlbum ? (
        <List>
          {fake[selectedArtist][selectedAlbum].map((song) => (
            <button key={song} onClick={() => playSong(song)}>
              {song}
            </button>
          ))}
        </List>
      ) : undefined} */}
    </>
  );
}
