import axios from "axios";
import { useState, useEffect } from "react";
import Modal from "./Modal.js";

import styles from "./SendMessage.module.css";

import ButtonLoader from "../UI/Spinner/ButtonLoader.js";

function SendProfileMessage({ display, onClose, profile }) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const [awaitingResponse, setAwaitingResponse] = useState(false);

  function sendMessage(event) {
    event.preventDefault();
    setAwaitingResponse(true);

    //console.log(profile);

    axios
      .post("/api/profile-page", {
        messageSubject: subject,
        messageBody: body,
        recipientAccountID: profile.accountId,
      })
      .then((response) => {
        setAwaitingResponse(true);
        ////console.log(response);
        onClose();
      })
      .catch((err) => {
        setAwaitingResponse(false);
        ////console.log(err);
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
            disabled={awaitingResponse}
          />
          <textarea
            className={styles["sendAMessage-body"]}
            maxLength={65535}
            value={body}
            required
            placeholder="Write your message here"
            onChange={(event) => setBody(event.target.value)}
            disabled={awaitingResponse}
          />
          <button type="submit" class={styles["sendAMessage-sendButton"]}>
            {awaitingResponse ? <ButtonLoader message={"Send"} /> : "Send"}
          </button>
        </form>
      </>
    </Modal>
  );
}

export default SendProfileMessage;
