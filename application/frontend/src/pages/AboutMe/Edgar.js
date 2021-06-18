import React from "react";

import styles from "./AboutMe.module.css";

function Edgar() {
  return (
    <div className={styles["about-me-container"]}>
      <div className={styles["about-me-card"]}>
        <span className={styles["about-me-header"]}>Hi, my name is Edgar</span>
        <br />
        <br />
        <div className={styles["about-me-body"]}>
          I am a Senior at San Francisco State University. When I am not
          learning about technology or computer science. I enjoy hanging out
          friends or going on hikes
        </div>
        <img className={styles["about-me-img"]} />
      </div>
    </div>
  );
}

export default Edgar;
