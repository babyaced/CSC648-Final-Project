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

  console.log("comments: ", comments);

  useEffect(() => {
    getComments();
  }, [display]); //this will refresh if they close the modal and come back!

  function submitComment(event) {
    event.preventDefault();

    console.log(createdCommentBody);

    axios
      .post("/api/comment", {
        body: createdCommentBody,
        postId: selectedPost.post_id,
      })
      .then((res) => {
        //console.log("Response: ", response);
        console.log(res.data);
        setComments([...comments, res.data]);
      })
      .catch((err) => {
        //console.log(err);
      });
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
    if (comments.length === 0)
      displayComment = (
        <li className={styles.CommentsPlaceholder}>No Comments yet</li>
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
        <div className={styles.PhotoPostContainer}>
          <div className={styles.PostPhotoContainer}>
            <img src={selectedPost.link} alt={selectedPost.link} />
          </div>
          <div className={styles.PhotoPostContent}>
            <div className={styles.PostInfo}>
              <img
                className={styles.PosterPic}
                src={selectedPost.profile_pic_link}
                alt={selectedPost.profile_pic_link}
              />
              <div className={styles.PosterName}>
                <h5>{selectedPost.display_name}</h5>
              </div>
              <div className={styles.PostTimestamp}>
                {new Date(selectedPost.timestamp).toLocaleString()}
              </div>
            </div>
            <div className={styles.PostBody}>{selectedPost.body}</div>
            <ul className={styles.PostComments}>{displayComment}</ul>
            <form className={styles.CommentBox} onSubmit={submitComment}>
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
        <div className={styles.TextPostContainer}>
          <div className={styles.TextPostContent}>
            <div className={styles.PostInfo}>
              <img
                className={styles.PosterPic}
                src={selectedPost.profile_pic_link}
                alt={selectedPost.profile_pic_link}
              />
              <div className={styles.PosterName}>
                <h3>{selectedPost.display_name}</h3>
              </div>
              <div className={styles.PostTimestamp}>
                {new Date(selectedPost.timestamp).toLocaleString()}
              </div>
            </div>
            <div className={styles.PostBody}>{selectedPost.body}</div>
            <ul className={styles.PostComments}>{displayComment}</ul>
            <form className={styles.PostCommentBox} onSubmit={submitComment}>
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
