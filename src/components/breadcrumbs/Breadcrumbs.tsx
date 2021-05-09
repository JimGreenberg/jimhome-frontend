import React from "react";
import "./Breadcrumbs.scss";

interface BreadcrumbsProps {
  labels: Array<string>;
  onLabelClick: (clicked: number) => void;
}

export default function Breadcrumbs(props: BreadcrumbsProps) {
  return (
    <div className="breadcrumbs">
      {props.labels.map((label, i) => (
        <React.Fragment key={i}>
          <button onClick={() => props.onLabelClick(i)}>
            {label}
          </button>
          {i < props.labels.length - 1 ? (
            <span className="arrow">
              &nbsp;&gt;&nbsp;
            </span>
          ) : undefined}
        </React.Fragment>
      ))}
    </div>
  );
}
