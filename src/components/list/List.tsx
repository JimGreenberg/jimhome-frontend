import "./List.scss";

export default function List (props: { children: JSX.Element[] }) {
  return(
  <div className="list">
    {props.children}
  </div>
  )
}
