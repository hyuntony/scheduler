import React from "react";
import classNames from "classnames";

import "./InterviewerListItem.scss";

export default function InterviewerListItem(props) {
  const { name, avatar, setInterviewer} = props;

  const liClass = classNames({
    'interviewers__item': true,
    'interviewers__item--selected': props.selected
  })
  const imgClass = classNames({
    'interviewers__item-image': true,
    'interviewers__item--selected-image': props.selected
  })

  return (
    <li className={liClass} onClick={(() => setInterviewer(name))}>
      <img
        className={imgClass}
        src={avatar}
        alt={name}
      />
      {props.selected ? name: null}
    </li>
  )
}