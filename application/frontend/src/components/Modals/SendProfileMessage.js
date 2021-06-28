import axios from "axios";
import { useState, useEffect } from "react";
import Modal from "./Modal.js";

import styles from "./SendMessage.module.css";

function SendProfileMessage({ display, onClose, profile }) {
  const [sendSuccess, setSendSuccess] = useState(false);

  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  function sendMessage(event) {
    event.preventDefault();

    console.log(profile);

    axios
      .post("/api/profile-page", {
        messageSubject: subject,
        messageBody: body,
        recipientAccountID: profile.accountId,
      })
      .then((response) => {
        //console.log(response);
        onClose();
      })
      .catch((err) => {
        //console.log(err);
        //display Error message e.g: try again
      });
  }

  if (!display) return null;
  return (
    <Modal display={display} onClose={onClose}>
      <>
        <h1 className={styles["sendAMessage-header"]}>Send a Message</h1>
        <form
          className={styles["send-a-message-container"]}
          onSubmit={sendMessage}
        >
          <input
            className={styles["sendAMessage-subject"]}
            maxLength={78}
            required
            placeholder="Subject"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
          />
          <textarea
            className={styles["sendAMessage-body"]}
            maxLength={65535}
            value={body}
            required
            placeholder="Write your message here"
            onChange={(event) => setBody(event.target.value)}
          />
          <button type="submit" class={styles["sendAMessage-sendButton"]}>
            Send
          </button>
        </form>
      </>
    </Modal>
  );
}

export default SendProfileMessage;
