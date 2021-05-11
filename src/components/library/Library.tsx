import React, { useEffect } from "react";
import { MpdClient } from "../../api/mpd-client";
import List from "../list/List";
import Breadcrumbs from "../breadcrumbs/Breadcrumbs";
import "./Library.scss";

export default function Library() {
  const [listState, setListState] = React.useState<Array<string>>([]);
  const [selectedArtist, setSelectedArtist] = React.useState<string | undefined>();
  const [selectedAlbum, setSelectedAlbum] = React.useState<string | undefined>();

  useEffect(() => {
    listArtists();
    setSelectedArtist(undefined);
    setSelectedAlbum(undefined);
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
      setSelectedArtist(artist);
      listAlbums(artist);
    } else if (selectedArtist && !selectedAlbum) {
      const album = item.replace(/^Album: /, "");
      setSelectedAlbum(item);
      listSongs(album);
    } else if (selectedArtist && selectedAlbum) {
      MpdClient.addSong(item);
    } else {
      console.error("illegal");
    }
  }

  function listArtists(): void {
    MpdClient.listArtists().then(artists => setListState(artists));
  }

  function listAlbums(artist: string): void {
    MpdClient.listAlbums(artist).then(albums => setListState(albums));
  }

  function listSongs(album: string): void {
    MpdClient.listTitles(album).then(songs => setListState(songs));
  }

  return (
    <>
      <Breadcrumbs labels={["All", selectedArtist, selectedAlbum].filter((label): label is string => !!label)} onLabelClick={onLabelClick}/>
      <h1>{selectedAlbum ? selectedAlbum : selectedArtist ? selectedArtist : "Artists"}</h1>
      <List>
        {listState.map((_item) => (
          <button key={_item} onClick={() => onListItemClick(_item)}>
            {_item}
          </button>
        ))}
      </List>
    </>
  );
}
