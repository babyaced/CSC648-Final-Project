import axios from "axios";
import React from "react";

import styles from "./ConfirmDeletion.module.css";

import Modal from "./Modal";

function ConfirmDeletion({
  display,
  onClose,
  selectedPet,
  message,
  deleteAction,
}) {
  return (
    <Modal display={display} onClose={onClose}>
      <div className={styles["delete-pet-container"]}>
        <div className={styles["delete-pet-header"]}>Are you Sure?</div>
        <div className={styles["delete-pet-body"]}>{message}</div>
        <button
          className={styles["delete-pet-confirm-button"]}
          onClick={deleteAction}
        >
          Delete
        </button>
      </div>
    </Modal>
  );
}

export default ConfirmDeletion;
