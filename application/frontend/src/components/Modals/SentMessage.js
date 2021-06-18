import styles from "./ViewMessage.module.css";

import Modal from "./Modal";

function SentMessage({ display, onClose, selectedMessage }) {
  // useEffect(() => {
  // }, [display])  //this will refresh if they close the modal and come back!

  return (
    <Modal display={display} onClose={onClose}>
      <div className={styles["view-message-header"]}>
        {selectedMessage.subject}
      </div>
      <div className={styles["view-message-container"]}>
        <div className={styles["view-message-sender"]}>
          To: {selectedMessage.display_name}
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

export default SentMessage;
