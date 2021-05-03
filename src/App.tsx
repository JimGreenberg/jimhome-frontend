import YoutubeSearch from "./components/youtube-search/YoutubeSearch";
import ButtonToggle from "./components/button-toggle/ButtonToggle";

function App() {
  return (
    <ButtonToggle
      titles={["Youtube URL", "Search Youtube", "Jim's Library"]}
      componentChildren={[
        <input placeholder="Youtube URL"/>,
        <YoutubeSearch />,
        <div style={{width: "50px", height: "50px", background: "red"}}></div>
      ]}/>
  );
}

export default App;
