import React from "react";

//import CSS
import styles from "./CommentCard.module.css";

function CommentCard({ comment }) {
  return (
    <li key={comment.comment_id}>
      <div className={styles["comment"]}>
        <img className={styles["profile-pic"]} src={comment.profile_pic_link} />
        <div className={styles["name"]}>{comment.display_name}</div>
        <div className={styles["timestamp"]}>
          {new Date(comment.timestamp).toLocaleString()}
        </div>
        <div className={styles["body"]}>{comment.body}</div>
        {/* <div className={styles['post-comment-likes']}>
                    {comment.like_count}  
                </div>
                <button className={styles['post-comment-like']}/> */}
      </div>
    </li>
  );
}

export default CommentCard;
