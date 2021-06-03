import "./ButtonShelf.scss";
import { MpdClient } from "../../api/mpd-client";

export default function ButtonShelf() {

  function previous(): void {
    MpdClient.previous()
  }
  function playPause(): void {
    MpdClient.status().then(({state}) => state === "play" ? MpdClient.pause() : MpdClient.play());
  }
  function stop(): void {
    MpdClient.stop()
  }
  function forward(): void {
    MpdClient.next()
  }

  return (
    <div className="button-shelf">
      <div>
        <div style={{flexGrow: 1}}></div>
        <button onClick={previous}></button>
        <button onClick={playPause}></button>
        <button onClick={stop}></button>
        <button onClick={forward}></button>
        <div style={{flexGrow: 1}}></div>
      </div>
    </div>
  );
}
