import React from "react";

import styles from "./ServerErrorMessage.module.css";

function ServerErrorMessage({ serverError }) {
  console.log("serverError: ", serverError);
  return (
    <div
      className={styles.ServerErrorMessage}
      style={serverError ? { visibility: "visible" } : { visibility: "hidden" }}
    >
      An Unexpected Server Error Occurred. Please try again
    </div>
  );
}

export default ServerErrorMessage;
