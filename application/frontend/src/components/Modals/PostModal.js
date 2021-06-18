import { React, useState, useEffect, useContext } from "react";

import styles from "./PostModal.module.css";

import Modal from "./Modal.js";
import axios from "axios";
import Spinner from "../UI/Spinner/Spinner";
import CommentCard from "../Cards/CommentCard/CommentCard";

function PostModal({ display, onClose, selectedPost }) {
  const [createdCommentBody, setCreatedCommentBody] = useState();

  const [loading, setLoading] = useState(false);

  const [comments, setComments] = useState([
    //Real version will fetch comments associated with post id of post passed in
  ]);

  useEffect(() => {
    getComments();
  }, [display]); //this will refresh if they close the modal and come back!

  function submitComment(event) {
    event.preventDefault();

    axios
      .post("/api/comment", {
        body: createdCommentBody,
        postId: selectedPost.post_id,
      })
      .then((response) => {
        console.log("Response: ", response);
      })
      .catch((err) => {
        console.log(err);
      });

    getComments(); //refresh so the user knows their comment has posted
  }

  function getComments() {
    setLoading(true);
    axios
      .get("/api/comments", { params: { post_id: selectedPost.post_id } })
      .then((response) => {
        setComments(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }

  let displayComment = <Spinner />;

  if (!loading) {
    if (comments.length == 0)
      displayComment = (
        <li className={styles["post-comments-placeholder"]}>No Comments yet</li>
      );
    else {
      displayComment =
        comments &&
        comments.map((comment) => <CommentCard comment={comment} />);
    }
  }

  return (
    <Modal display={display} onClose={onClose}>
      {selectedPost.link && (
        <div className={styles["post-container"]}>
          <div className={styles["post-image"]}>
            <img src={selectedPost.link} />
          </div>
          <div className={styles["post-content"]}>
            <div className={styles["post-detail"]}>
              <img
                className={styles["post-detail-pic"]}
                src={selectedPost.profile_pic_link}
              />
              <div className={styles["post-detail-name"]}>
                <h5>{selectedPost.display_name}</h5>
              </div>
              <div className={styles["post-detail-timestamp"]}>
                {new Date(selectedPost.timestamp).toLocaleString()}
              </div>
            </div>
            <div className={styles["post-body"]}>{selectedPost.body}</div>
            <ul className={styles["post-comments"]}>{displayComment}</ul>
            <form
              className={styles["post-leave-comment"]}
              onSubmit={submitComment}
            >
              <input
                value={createdCommentBody}
                maxLength="255"
                required
                placeholder="Write a Comment..."
                onChange={(e) => setCreatedCommentBody(e.target.value)}
              />
              <button type="submit">
                <span>Comment</span>
              </button>
            </form>
          </div>
        </div>
      )}
      {!selectedPost.link && (
        <div className={styles["post-container-no-image"]}>
          <div className={styles["post-content"]}>
            <div className={styles["post-detail"]}>
              <img
                className={styles["post-detail-pic"]}
                src={selectedPost.profile_pic_link}
              />
              <div className={styles["post-detail-name"]}>
                <h3>{selectedPost.display_name}</h3>
              </div>
              <div className={styles["post-detail-timestamp"]}>
                {new Date(selectedPost.timestamp).toLocaleString()}
              </div>
              <div className={styles["post-detail-body"]}>
                {selectedPost.body}
              </div>
            </div>
            <ul className={styles["post-comments"]}>{displayComment}</ul>
            <form
              className={styles["post-leave-comment"]}
              onSubmit={submitComment}
            >
              <input
                value={createdCommentBody}
                maxLength="255"
                required
                placeholder="Write a Comment..."
                onChange={(e) => setCreatedCommentBody(e.target.value)}
              />
              <button type="submit">
                <span>Comment</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </Modal>
  );
}

export default PostModal;
