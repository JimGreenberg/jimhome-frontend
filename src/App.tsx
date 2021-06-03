import "./App.scss";

import YoutubeSearch from "./components/youtube-search/YoutubeSearch";
import ButtonToggle from "./components/button-toggle/ButtonToggle";
import Library from "./components/library/Library";
import ButtonShelf from "./components/button-shelf/ButtonShelf";
import NowPlaying from "./components/now-playing/NowPlaying";
import Shelf from "./components/shelf/Shelf";
import youtube from "./assets/old-youtube.png";
import tvframe from "./assets/tvframe.png";
import music from "./assets/old-itunes.png";
import pattern from "./assets/pattern.jpg";
import { MpdClient } from "./api/mpd-client";

function App() {
  MpdClient.connect();
  return (
    <>
      <ButtonToggle
        titles={[
          <>
            📻<span style={{ fontFamily: "arial" }}>&nbsp;&nbsp;</span>
            {/* HACK, the other font renders &nbsp; as a character */}
            <span>Now Playing</span>
          </>,
          <>
            <img src={youtube} alt="Youtube" />
            <span>YouTube</span>
          </>,
          <>
            <img src={music} alt="Jim's Library" />
            <span>Jim's Library</span>
          </>,
        ]}
        componentChildren={[
          <>
            <NowPlaying />
            {/* <img className="pattern" src={pattern} alt="" />
            <div className="other-triangle"></div> */}
          </>,
          <YoutubeSearch />,
          <Library />,
        ]}
      />
      <ButtonShelf />
      {/* <Shelf /> */}
    </>
  );
}

export default App;
