import React, { ReactElement } from "react";

import "./ButtonToggle.scss";

interface ButtonToggleProps {
  componentChildren: Array<ReactElement>;
  titles: Array<ReactElement | string>;
}

interface ButtonToggleState {
  selected: number,
  previousSelected: number,
  showPrevious: boolean,
  direction: "forward" | "reverse";
}

class ButtonToggle extends React.Component<ButtonToggleProps, ButtonToggleState> {
  state: ButtonToggleState = {
    selected: 0,
    previousSelected: 0,
    showPrevious: false,
    direction: "reverse"
  }
  currentTimeout?: ReturnType<typeof setTimeout>;

  private onClick(selected: number) {
    if (selected !== this.state.selected) {
      this.currentTimeout && clearTimeout(this.currentTimeout);
      this.setState({
        selected,
        previousSelected: this.state.selected,
        showPrevious: true,
        direction: selected < this.state.selected ? "forward" : "reverse",
      });
      this.currentTimeout = setTimeout(() => this.setState({ showPrevious: false }), 500);
    }
  }

  render() {
    let shownItems;
    if (this.state.showPrevious) {
      if (this.state.selected < this.state.previousSelected) {
        shownItems = [this.state.selected, this.state.previousSelected];
      } else {
        shownItems = [this.state.previousSelected, this.state.selected];
      }
    } else {
      shownItems = [this.state.selected]
    }
    return (
      <div className="button-toggle-root">
        <div className="button-container">
          {
          this.props.titles.map((title, i) => (
            <button className={`${this.state.selected === i ? "selected" : ""}`} onClick={() => this.onClick(i)} key={i}>{title}</button>
          ))
          }
        </div>
        <div className={`content-container ${this.state.showPrevious ? this.state.direction : ""}`}>
          {
          shownItems.map(key => {
            return <div className="content-wrapper" key={key}>{this.props.componentChildren[key]}</div>
          })
          }
        </div>
      </div>
    );
  }
}

export default ButtonToggle;
