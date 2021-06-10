//Import Libraries
import { useEffect, useState } from "react";
import axios from "axios";

//Import UI Components
import Tab from "../../components/UI/Tab/Tab.js"
import RecievedMessage from "../../components/Modals/RecievedMessage";
import SentMessage from "../../components/Modals/SentMessage";
import AddIcon from "../../assets/icons/created/AddWhite.svg";
import SendMessage from "../../components/Modals/SendMessage";
import Spinner from "../../components/UI/Spinner/Spinner";
import MessageCard from "../../components/Cards/MessageCard/MessageCard"

//Import CSS
import styles from "./Messages.module.css";


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

  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    const getSentMessages = axios.get("/api/sent-messages");
    const getRecievedMessages = axios.get("/api/recieved-messages");

    Promise.all([getRecievedMessages, getSentMessages])
      .then((responses) => {
        setRecievedMessages(responses[0].data);
        setSentMessages(responses[1].data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
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

  let messages = <></>;

  if (!loading)
    messages = (
      <>
        {selectedTab === 0 && recievedMessages.length == 0 && (
          <div className={styles["messages-container-no-messages"]}>
            You have no new messages :(
          </div>
        )}
        {selectedTab === 0 &&
          recievedMessages.map((recievedMessage) => (
            <>
              <MessageCard key={recievedMessage.message_id}  message={recievedMessage} viewModal={() => viewRecievedMessageModal(recievedMessage)}/>
            </>
          ))}
        {selectedTab === 1 && sentMessages.length == 0 && (
          <div className={styles["messages-container-no-messages"]}>
            You have no new messages :(
          </div>
        )}
        {selectedTab === 1 &&
          sentMessages.map((sentMessage) => (
            <>
              <MessageCard key={sentMessage.message_id} message={sentMessage} viewModal={() => viewSentMessageModal(sentMessage)}/>
            </>
          ))}
        <button
          className={styles["new-message-button"]}
          onClick={() => setSendMessageModalDisplay(true)}
        >
          <span className={styles['new-message-text']}>New Message</span>
          <img src={AddIcon}/>
        </button>
      </>
    );

  return (
    <>
      {loading ? <Spinner/> :
        <>
          <div className={`${styles["messages-container"]} ${"container"}`}>
            <div className={styles["container-header"]}>
              <div className={styles["messages-header"]}>Messages</div>
              <div className={styles["tabs"]}>
                {tabs}
              </div>
          </div>
          <div className={styles["recieved-messages-container"]}>
            {messages}
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
      }
      
    </>
  );
}

export default Messages;
