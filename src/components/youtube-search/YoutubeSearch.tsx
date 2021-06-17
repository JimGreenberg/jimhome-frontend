import React from "react";
import "./YoutubeSearch.scss"

import Item from "../item/Item";

import  "../../util/addDebouncedEventListener";
import { data } from "./fake-fetch-data";
// import { youtubeSearch } from "../../api/youtube-search";
import { postYouTubeUrlToNuc } from "../../api/post-youtube-url-to-nuc";

export default class YoutubeSearch extends React.Component {

  state = {
    items: new Array<any>()
  }

  // componentDidMount() {
  //   const searchEl = document.getElementById(
  //     "search"
  //   ) as HTMLInputElement | null;
  //   let lastQuery = "";
  //   searchEl &&
  //     searchEl.addDebouncedEventListener("keydown", 500, (event) => {
  //       const match = event.key.match(/Backspace|Enter|[\d\w]/);
  //       if (searchEl.value.match(/http/)) return; // early return for links
  //       if (lastQuery !== searchEl.value && match && match[0] === match.input) {
  //         // youtubeSearch(searchEl.value)
  //         // .then((response) => response.json())
  //         Promise.resolve(data)
  //           .then(({ items }) => this.setState({items}));
  //       }
  //     });
  // }

  post() {
    const searchEl = document.getElementById(
      "search"
    ) as HTMLInputElement | null;
    if (!searchEl) return;
    if (searchEl.value.match(/youtube\.com\/watch\?/)) { // quick n dirty check
      postYouTubeUrlToNuc(searchEl.value);
      searchEl.value = "";
    }
  }

  render() {
    return (
      <>
        <input id="search" placeholder="YouTube URL" />
        <button onClick={() => this.post()}>POST</button>
        {/* <ul id="search-results">
          {this.state.items.map(item => (
            <Item
              key={item.etag}
              thumbTitle={item.snippet.title}
              thumbDescription={item.snippet.channelTitle}
              imgUrl={item.snippet.thumbnails.high.url}
              duration={item.contentDetails.duration}
            />
          ))}
        </ul> */}
      </>
    );
  }
}
