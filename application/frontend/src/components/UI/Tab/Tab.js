import React from "react";

import styles from "./Tab.module.css";

function Tab(props) {
  let textStyle = styles.Text;
  let tabStyle = styles.Tab;
  if (props.id === props.selected) {
    textStyle = [styles.Text, styles.ActiveText].join(" ");
    tabStyle = [styles.Tab, styles.ActiveTab].join(" ");
  }

  return (
    <div className={tabStyle} onClick={() => props.clicked(props.id)}>
      <span className={textStyle}>
        {props.section + " (" + props.length + ")"}
      </span>
    </div>
  );
}

export default Tab;
