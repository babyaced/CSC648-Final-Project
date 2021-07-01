import React from "react";

import styles from "./PrimaryButton.module.css";

function PrimaryButton({ children }) {
  return (
    <button className={styles["call-to-action-button"]}>{children}</button>
  );
}

export default PrimaryButton;
