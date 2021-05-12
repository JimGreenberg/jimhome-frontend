import "./App.scss";

import YoutubeSearch from "./components/youtube-search/YoutubeSearch";
import ButtonToggle from "./components/button-toggle/ButtonToggle";
import Library from "./components/library/Library";
import Shelf from "./components/shelf/Shelf";
import youtube from "./assets/old-youtube.png";
import tvframe from "./assets/tvframe.png";
import music from "./assets/old-itunes.png";
import pattern from "./assets/pattern.jpg";
import { MpdClient } from "./api/mpd-client";

function App() {
  MpdClient.connect();
  return (<>
    <ButtonToggle
      titles={[
        <>
          <img src={youtube} alt="Youtube URL"/>
          Youtube URL
        </>,
        <>
          <img src={youtube} alt="Search Youtube"/>
          Search Youtube
        </>,
        <>
          <img src={music} alt="Jim's Library"/>
          Jim's Library
        </>,
      ]}
      componentChildren={[
        <>
          <input placeholder="Youtube URL" />
          <img className="pattern" src={pattern} alt=""/>
          <div className="other-triangle"></div>
        </>,
        <YoutubeSearch />,
        <Library />,
      ]}
    />
    <Shelf/>
  </>);
}

export default App;
