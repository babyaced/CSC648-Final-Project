import { useEffect, useState } from "react";
import axios from "axios";

import Tab from "./Tab";

import styles from "./Messages.module.css";
import RecievedMessage from "../../components/Modals/RecievedMessage";
import SentMessage from "../../components/Modals/SentMessage";
import AddIcon from "../../images/Created Icons/AddWhite.svg";
import SendMessage from "../../components/Modals/SendMessage";
import Spinner from "../../components/UI/Spinner/Spinner";

function Messages() {
  const [recievedMessageModalDisplay, setRecievedMessageModalDisplay] =
    useState(false);
  const [sentMessageModalDisplay, setSentMessageModalDisplay] = useState(false);
  const [sendMessageModalDisplay, setSendMessageModalDisplay] = useState(false);

  const [selectedMessage, setSelectedMessage] = useState({});

  const [recievedMessages, setRecievedMessages] = useState([]);
  const [sentMessages, setSentMessages] = useState([]);

  const [possibleMessageRecipients, setPossibleMessageRecipients] = useState(
    []
  );

  const [loading, setLoding] = useState(false);

  function viewSentMessageModal(message) {
    setSelectedMessage(message);
    setSentMessageModalDisplay(true);
  }

  function viewRecievedMessageModal(message) {
    setSelectedMessage(message);
    setRecievedMessageModalDisplay(true);
  }

  function getMessages() {
    //retrieve currently logged in user's messages
    setLoding(true);
    const getSentMessages = axios.get("/api/sent-messages");
    const getRecievedMessages = axios.get("/api/recieved-messages");

    Promise.all([getRecievedMessages, getSentMessages])
      .then((responses) => {
        setRecievedMessages(responses[0].data);
        setSentMessages(responses[1].data);
        setLoding(false);
      })
      .catch((err) => {
        setLoding(false);
      });
  }

  function getMessageRecipients() {
    const getFollowers = axios.get("/api/followers");
    const getFollows = axios.get("/api/following");

    Promise.all([getFollowers, getFollows]).then((responses) => {

      const followers = responses[0].data;
      const follows = responses[1].data;

      let followersAndFollows = followers.concat(follows);

      let recipients = [];
      let recipientSet = new Set();

      //followers and follows
      for (const person of followersAndFollows) {
        const personJSON = JSON.stringify(person); //stringify to check uniqueness
        if (!recipientSet.has(personJSON)) {
          recipients.push(person);
        }
        recipientSet.add(personJSON);
      }
      //create array compatible with react-select
      let recipientOptions = [];
      for (const recipient of recipients) {
        recipientOptions.push({
          value: recipient.profile_id,
          label: recipient.display_name,
          pic: recipient.profile_pic_link,
        });
      }


      setPossibleMessageRecipients(recipientOptions);
    });
  }

  function updateSentMessages(newSentMessage) {
    // setSentMessages([...sentMessages, newSentMessage]);
  }

  useEffect(() => {
    //retrieve messages on refresh
    getMessages();
    getMessageRecipients();
    // getFollowers(); //get followers/followed to populate dropdown in send message modal
  }, []);

  const [selectedTab, setSelectedTab] = useState(0);

  const onTabClicked = (value) => {
    setSelectedTab(value);
  };

  let tabs = ["Received", "Sent"].map((tab, index) => (
    <Tab
      key={tab}
      id={index}
      section={tab}
      selected={selectedTab}
      length={index === 0 ? recievedMessages.length : sentMessages.length}
      clicked={onTabClicked}
    />
  ));

  let displayMessage = <Spinner />;

  if (!loading)
    displayMessage = (
      <>
        {selectedTab === 0 && recievedMessages.length == 0 && (
          <div className={styles["messages-container-no-messages"]}>
            You have no new messages :(
          </div>
        )}
        {selectedTab === 0 &&
          recievedMessages.map((recievedMessage) => (
            <>
              <div
                key={recievedMessage.message_id}
                className={styles["messages-container-message"]}
                onClick={() => viewRecievedMessageModal(recievedMessage)}
              >
                <img
                  className={styles["messages-container-message-pic"]}
                  src={recievedMessage.profile_pic_link}
                />
                <div className={styles["messages-container-message-subject"]}>
                  {recievedMessage.subject}
                </div>
                <div className={styles["messages-container-message-timestamp"]}>
                  {new Date(recievedMessage.timestamp).toLocaleString()}
                </div>
                <div className={styles["messages-container-message-sender"]}>
                  {recievedMessage.display_name}
                </div>
              </div>
            </>
          ))}
        {selectedTab === 1 && sentMessages.length == 0 && (
          <div className={styles["messages-container-no-messages"]}>
            You have no messages :(
          </div>
        )}
        {selectedTab === 1 &&
          sentMessages.map((sentMessage) => (
            <>
              <div
                key={sentMessage.message_id}
                className={styles["messages-container-message"]}
                onClick={() => viewSentMessageModal(sentMessage)}
              >
                <img
                  className={styles["messages-container-message-pic"]}
                  src={sentMessage.profile_pic_link}
                />
                <div className={styles["messages-container-message-subject"]}>
                  {sentMessage.subject}
                </div>
                <div className={styles["messages-container-message-timestamp"]}>
                  {new Date(sentMessage.timestamp).toLocaleString()}
                </div>
                <div className={styles["messages-container-message-sender"]}>
                  {sentMessage.display_name}
                </div>
              </div>
            </>
          ))}
        <button
          className={styles["new-message-button"]}
          onClick={() => setSendMessageModalDisplay(true)}
        >
          <img src={AddIcon} className={styles["new-message-icon"]} />
          {/* <span className={styles['new-message-text']}>New Message</span> */}
        </button>
      </>
    );

  return (
    <>
      <div className={`${styles["messages-container"]} ${"container"}`}>
        <div className={styles["tabs-container"]}>
          <div className={styles["tabs"]}>
            <div className={styles["messages-header"]}>Messages</div>
            <div className="double-tabs" style={{ display: "flex" }}>
              {tabs}
            </div>
          </div>
        </div>
        <div className={styles["recieved-messages-container"]}>
          {displayMessage}
        </div>
      </div>
      <RecievedMessage
        display={recievedMessageModalDisplay}
        updateSentMessages={updateSentMessages}
        onClose={() => setRecievedMessageModalDisplay(false)}
        selectedMessage={selectedMessage}
      ></RecievedMessage>
      <SentMessage
        display={sentMessageModalDisplay}
        onClose={() => setSentMessageModalDisplay(false)}
        selectedMessage={selectedMessage}
      ></SentMessage>
      <SendMessage
        display={sendMessageModalDisplay}
        onClose={() => setSendMessageModalDisplay(false)}
        recipientOptions={possibleMessageRecipients}
      />
    </>
  );
}

export default Messages;
