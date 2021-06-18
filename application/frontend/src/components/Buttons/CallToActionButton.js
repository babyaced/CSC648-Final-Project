import React from "react";

import styles from "./CallToActionButton.module.css";

function CallToActionButton({ children }) {
  return (
    <button className={styles["call-to-action-button"]}>{children}</button>
  );
}

export default CallToActionButton;
