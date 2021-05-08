import "./App.scss";

import YoutubeSearch from "./components/youtube-search/YoutubeSearch";
import ButtonToggle from "./components/button-toggle/ButtonToggle";
import youtube from "./assets/old-youtube.png";
import music from "./assets/old-itunes.png";
import pattern from "./assets/pattern.jpg";
import { MpdClient } from "./api/mpd-client";

function App() {
  const mpd = new MpdClient();
  function connect() {
    // todo
  }
  return (
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
        <>
          <button onClick={connect}>POST</button>
        </>,
      ]}
    />
  );
}

export default App;
