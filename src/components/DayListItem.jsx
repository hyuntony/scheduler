import React from "react";
import classNames from "classnames";

import "components/DayListItem.scss";

export default function DayListItem(props) {
  const liClass = classNames({
    'day-list__item': true,
    'day-list__item--selected': props.selected,
    'day-list__item--full': props.spots === 0
 });

  let spotMessage = `${props.spots} spots remaining`;
  if (!props.spots) {
    spotMessage = "no spots remaining";
  };
  if (props.spots === 1) {
    spotMessage = "1 spot remaining";
  };


  return (
    <li className={liClass} onClick={() => props.setDay(props.name)} data-testid="day">
      <h2 className="text--regular">{props.name}</h2>
      <h3 className="text--light">{spotMessage}</h3>
    </li>
  );
};