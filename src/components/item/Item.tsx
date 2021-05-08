import React from "react";
import "./Item.scss";

interface ItemProps {
  thumbTitle: string;
  imgUrl?: string;
  thumbDescription?: string;
  duration?: string | number;
}

class Item extends React.Component<ItemProps> {
  render() {
    return (
      <li>
        <div className="img-container">
          <img src={this.props.imgUrl} alt=""/>
          <span className="duration">{this.props.duration}</span>
        </div>
        <div className="info-container">
          <span className="title">{this.props.thumbTitle}</span>
          <span className="description">{this.props.thumbDescription}</span>
        </div>
      </li>
    );
  }
}

(Item as any).defaultProps = {
  duration: "n/a"
}

export default Item;
