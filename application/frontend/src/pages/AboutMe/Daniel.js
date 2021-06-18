import React from "react";

import styles from "./AboutMe.module.css";

import DanielJpg from "../../assets/images/created/Daniel.jpg";

function Daniel() {
  return (
    <div className={styles["about-me-container"]}>
      <div className={styles["about-me-card"]}>
        <span className={styles["about-me-header"]}>
          Hi, my name is Daniel.
        </span>
        <br />
        <br />
        <div className={styles["about-me-body"]}>
          I am a senior at SFSU studying Computer Science. I like making web
          applications like the one you are looking at right now and
          experimenting with their design. When I am not coding, I enjoy
          playing/watching basketball and videogames.
        </div>
        <img className={styles["about-me-img"]} src={DanielJpg} />
      </div>
    </div>
  );
}

export default Daniel;
