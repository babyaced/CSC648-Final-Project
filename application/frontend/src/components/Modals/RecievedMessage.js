import { useState, useEffect } from "react";

import styles from "./ViewMessage.module.css";

import Modal from "./Modal";
import axios from "axios";

function RecievedMessageModal({ display, onClose, selectedMessage }) {
  return (
    <Modal display={display} onClose={onClose}>
      <div className={styles["view-message-header"]}>
        <h3>{selectedMessage.subject}</h3>
      </div>
      <div className={styles["view-message-container"]}>
        <div className={styles["view-message-sender"]}>
          From: {selectedMessage.display_name}
        </div>
        <div className={styles["view-message-timestamp"]}>
          {new Date(selectedMessage.timestamp).toLocaleString()}
        </div>
        <div className={styles["view-message-body"]}>
          {selectedMessage.body}
        </div>
      </div>
    </Modal>
  );
}

export default RecievedMessageModal;
