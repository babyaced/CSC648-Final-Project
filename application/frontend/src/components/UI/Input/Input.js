import React from "react";

import styles from "./Input.module.css";

function Input(props) {
  const inputClasses = [styles.InputElement];

  // invalid check
  let validationError = null;
  if (!props.valid && props.touched) {
    validationError = (
      <p className={styles.ErrorMessage}>Passwords Do Not Match</p>
    );
    inputClasses.push(styles.Invalid);
  }

  return (
    <div className={styles.Input}>
      <input
        className={inputClasses.join(" ")} // join two styles
        {...props.config}
        value={props.value}
        onChange={props.changed}
      />
      {validationError}
    </div>
  );
}

export default Input;
