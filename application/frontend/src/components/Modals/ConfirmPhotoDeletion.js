import React from "react";

import styles from "./ConfirmDeletion.module.css";

import Modal from "./Modal";

function ConfirmPhotoDeletion({ display, onConfirm, onClose }) {
  return (
    <Modal display={display} onClose={onClose}>
      <div className={styles["delete-pet-container"]}>
        <div className={styles["delete-pet-header"]}>Are you Sure?</div>
        <div className={styles["delete-pet-body"]}>
          Delete this Photo from your account?
        </div>
        {/* <button className={styles['delete-pet-cancel-button']}>Cancel</button> */}
        <button
          className={styles["delete-pet-confirm-button"]}
          onClick={onConfirm}
        >
          Delete
        </button>
      </div>
    </Modal>
  );
}

export default ConfirmPhotoDeletion;
