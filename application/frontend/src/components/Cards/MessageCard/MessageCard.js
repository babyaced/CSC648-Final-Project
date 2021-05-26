//Import Libraries
import React from 'react'

//Import CSS
import styles from "./MessageCard.module.css";

function MessageCard({message, viewModal}) {
    return (
        <div key={message.message_id} className={styles["messages-container-message"]} onClick={() => viewModal()}>
            <img className={styles["messages-container-message-pic"]} src={message.profile_pic_link}/>
            <div className={styles["messages-container-message-subject"]}>{message.subject}</div>
            <div className={styles["messages-container-message-timestamp"]}>{new Date(message.timestamp).toLocaleString()}</div>
            <div className={styles["messages-container-message-sender"]}>{message.display_name}</div>
        </div>
    )
}

export default MessageCard
