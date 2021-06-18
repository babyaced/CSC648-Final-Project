import React from "react";

import styles from "./EditButton.module.css";

import EditIcon from "../../assets/icons/thirdparty/icons8-edit.svg";

function EditButton(props) {
  let editIcon = null;
  let buttonStyles = styles.Button;
  if (props.edit) editIcon = <img src={EditIcon} className={styles.editIcon} />;
  if (props.save) buttonStyles = styles.Button;
  return (
    <button
      className={buttonStyles}
      onClick={props.clicked}
      style={props.style}
    >
      {props.children}
      {editIcon}
    </button>
  );
}

export default EditButton;
