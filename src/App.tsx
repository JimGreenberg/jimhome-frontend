import "./App.scss";

import YoutubeSearch from "./components/youtube-search/YoutubeSearch";
import ButtonToggle from "./components/button-toggle/ButtonToggle";
import youtube from "./assets/old-youtube.png";
import music from "./assets/old-itunes.png";
import pattern from "./assets/pattern.jpg";
import React from "react";

function App() {
  return (
    <ButtonToggle
      titles={[
        <React.Fragment>
          <img src={youtube} />
          Youtube URL
        </React.Fragment>,
        <React.Fragment>
          <img src={youtube} />
          Search Youtube
        </React.Fragment>,
        <React.Fragment>
          <img src={music} />
          Jim's Library
        </React.Fragment>,
      ]}
      componentChildren={[
        <React.Fragment>
          <input placeholder="Youtube URL" />
          <img className="pattern" src={pattern}/>
          <div className="other-triangle"></div>
        </React.Fragment>,
        <YoutubeSearch />,
        <React.Fragment>
          <div className="teal">teal</div> <div className="black">black</div> <div className="purple">purple</div> <div className="dteal">dteal</div> <div className="yellow">yellow</div> <div className="pink">pink</div> <div className="white">white</div>
        </React.Fragment>,
      ]}
    />
  );
}

export default App;
