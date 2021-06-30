import axios from "axios";
import { useState, useEffect } from "react";
import Modal from "./Modal.js";

import styles from "./SendMessage.module.css";

import ButtonLoader from "../UI/Spinner/ButtonLoader.js";

import ServerErrorMessage from "../InfoMessages/ServerErrorMessage";

function SendProfileMessage({ display, onClose, profile }) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const [awaitingResponse, setAwaitingResponse] = useState(false);

  const [serverError, setServerError] = useState(false);

  function sendMessage(event) {
    event.preventDefault();
    setServerError(false);
    setAwaitingResponse(true);

    //console.log(profile);

    axios
      .post("/api/message/profile-page", {
        messageSubject: subject,
        messageBody: body,
        recipientAccountID: profile.accountId,
      })
      .then((response) => {
        setAwaitingResponse(false);
        ////console.log(response);
        onClose();
      })
      .catch((err) => {
        if (err.response.status === 500) {
          setServerError(true);
          setAwaitingResponse(false);
        }
        ////console.log(err);
        //display Error message e.g: try again
      });
  }

  if (!display) return null;
  return (
    <Modal display={display} onClose={onClose}>
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
        <button
          type="submit"
          class={styles["sendAMessage-sendButton"]}
          disabled={awaitingResponse}
        >
          {awaitingResponse ? <ButtonLoader message={"Send"} /> : "Send"}
        </button>
      </form>
      <ServerErrorMessage serverError={serverError} />
    </Modal>
  );
}

export default SendProfileMessage;
