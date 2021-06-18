import React from "react";

import styles from "./SecondaryActionButton.module.css";

function SecondaryActionButton({ children }) {
  return (
    <button className={styles["secondary-action-button"]}>{children}</button>
  );
}

export default SecondaryActionButton;
