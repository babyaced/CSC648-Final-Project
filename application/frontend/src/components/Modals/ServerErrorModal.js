import React from "react";
import Modal from "./Modal";

import styles from "./ServerErrorModal.module.css";

function ServerErrorModal({ display, onClose, children }) {
  return (
    <Modal display={display} onClose={onClose}>
      <div className={styles.ServerErrorModalContent}>
        <h3>An Unexpected Server Error Occurred</h3>
        <p>{children}</p>
        <button onClick={onClose}>Ok</button>
      </div>
    </Modal>
  );
}

export default ServerErrorModal;
