import { useEffect, useState, useRef } from "react";
import "./NowPlaying.scss";
import tvframe from "../../assets/tvframe.png"
import { MpdClient } from "../../api/mpd-client";

export default function List() {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [album, setAlbum] = useState("");
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [queueNum, setQueueNum] = useState(0);
  const [playState, setPlayState] = useState("stop");
  const interval = useRef(0 as unknown as ReturnType<typeof setInterval>);


  useEffect(() => {
    getQueue();
    interval.current && clearInterval(interval.current);
    interval.current = setInterval(() => MpdClient.status().then(status => {
      getQueue();
      setTime(status.elapsed || 0);
      setDuration(status.duration || 0);
      setPlayState(status.state);
    }), 1000);

    return () => clearInterval(interval.current); // cleanup
  }, []);

  function getQueue() {
     MpdClient.getQueue().then((queue) => {
       setQueueNum(queue.length);
       if (!queue.length) return;
       setTitle(queue[0].Title || "");
       setArtist(queue[0].Artist || "");
       setAlbum(queue[0].Album || "");
     });
  }

  function secondsToTimeString(seconds: number): string {
    return `${
      Math.floor(seconds / 3600) > 1 ? Math.floor(seconds / 3600) + ":" : ""
    }${Math.floor(seconds / 60)}:${
      seconds % 60
        ? seconds % 60 < 10
          ? "0" + (seconds % 60)
          : seconds % 60
        : "00"
    }`;
  }

  return (
    <>
      <img className="tvframe" src={tvframe} alt=""/>
      <div className="fake-screen">
        <span className="status">{playState.toLocaleUpperCase()} {playState === "play" ? "▶︎" : playState === "pause" ? "" : "■"}</span>
        <span className="time">
          <span>{secondsToTimeString(time)}</span>
          <span>&nbsp;/&nbsp;</span>
          <span>{secondsToTimeString(duration)}</span>
        </span>
        <div className="main">
          <img alt=""/>
          <span className="song-title">{title}</span>
          <span className="artist">{artist}</span>
          <span className="album">{album}</span>
        </div>
        <div className="queue-container">
          <span className="queue">Queue</span>
          <span className="queue-num">{queueNum}</span>
        </div>
      </div>
    </>
  );
}
