import { useState } from "react";
import Modal from "./Modal";
import axios from "axios";
import Select from "react-select";
import { components } from "react-select";

import styles from "./SendMessage.module.css";

import SelectCustomTheme from "../../mods/SelectCustomTheme.js";

import ButtonLoader from "../UI/Spinner/ButtonLoader";
import ServerErrorMessage from "../InfoMessages/ServerErrorMessage";

const { Option } = components;

function SendMessage({
  display,
  onClose,
  profile,
  recipientOptions,
  updateSentMessagesState,
}) {
  const [serverError, setServerError] = useState(false);

  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const [recipient, setRecipient] = useState([]);

  const [awaitingResponse, setAwaitingResponse] = useState(false);

  function sendMessage(event) {
    event.preventDefault();
    setServerError(false);
    setAwaitingResponse(true);

    axios
      .post("/api/message/messages-page", {
        messageSubject: subject,
        messageBody: body,
        recipientProfileID: recipient[0].value, //contains profile id
      })
      .then((response) => {
        setAwaitingResponse(false);

        //console.log(response.data);
        onClose();
        updateSentMessagesState(response.data);
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

  const RecipientOption = (props) => (
    <Option {...props}>
      <img
        className={styles["option-recipient-image"]}
        src={props.data.pic}
        alt={"Recipient"}
      />
      <span className={styles["option-recipient-name"]}>
        {props.data.label}
      </span>
    </Option>
  );

  if (!display) return null;
  return (
    <Modal display={display} onClose={onClose}>
      <h1 className={styles["sendAMessage-header"]}>Send a Message</h1>
      <form
        className={styles["send-a-message-container"]}
        onSubmit={sendMessage}
      >
        <Select
          id="recipient"
          name="message-recipient"
          className={styles["sendAMessage-recipient-dropdown"]}
          onChange={(event) => setRecipient([event])}
          value={recipient}
          options={recipientOptions}
          theme={SelectCustomTheme}
          components={{ Option: RecipientOption }}
          placeholder="To"
          isSearchable
          disabled={awaitingResponse}
        />
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
export default SendMessage;
