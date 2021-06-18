import React from "react";

import styles from "./Tab.module.css";

function Tab(props) {
  let textStyle = styles.Text;
  let tabStyle = styles.Tab;
  if (props.id === props.selected) {
    textStyle = [styles.Text, styles.ActiveText].join(" ");
    tabStyle = [styles.Tab, styles.ActiveTab].join(" ");
  }

  let tabText = props.section;
  let aboutStyle = {};
  if (tabText === "About") {
    aboutStyle = { marginTop: "35px" };
    if (props.accountType === "PetOwner" || props.accountType === "Pet")
      tabText = props.section + " Me";
    else tabText = props.section + " Us";
  }

  return (
    <div className={tabStyle} onClick={() => props.clicked(props.id)}>
      <p className={textStyle} style={aboutStyle}>
        {tabText}
      </p>
    </div>
  );
}

export default Tab;
