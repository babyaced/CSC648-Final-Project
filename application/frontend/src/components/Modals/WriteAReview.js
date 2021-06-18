import React, { useState } from "react";
import Modal from "./Modal.js";

import styles from "./SendMessage.module.css";

// import Rating from '@material-ui/lab/Rating';
// import Box from '@material-ui/core/Box';

const labels = {
  0.5: "Useless",
  1: "Useless+",
  1.5: "Poor",
  2: "Poor+",
  2.5: "Ok",
  3: "Ok+",
  3.5: "Good",
  4: "Good+",
  4.5: "Excellent",
  5: "Excellent+",
};

function WriteAReview({ display, onClose, clicked }) {
  const [rating, setRating] = useState(4);
  const [review, setReview] = useState("");
  const [hover, setHover] = useState(-1);

  if (!display) return null;

  function submitReviewHandler(event) {
    event.preventDefault();
    clicked(rating, review);
    onClose();
  }

  return (
    <Modal display={display} onClose={onClose}>
      <form onSubmit={submitReviewHandler}>
        <h1 className={styles["sendAMessage-header"]}>Write a Review</h1>
        <div className={styles["send-a-message-container"]}>
          {/* <Rating
                        name="hover-feedback"
                        value={rating}
                        precision={0.5}
                        onChange={(event, newRating) => {
                            setRating(newRating);
                        }}
                        onChangeActive={(event, newHover) => {
                            setHover(newHover);
                        }}
                    /> */}
          {/* {rating !== null && <Box ml={2}>{labels[hover !== -1 ? hover : rating]}</Box>} */}
          <textarea
            className={styles["sendAMessage-body"]}
            onChange={(event) => setReview(event.target.value)}
          />
          <button class={styles["sendAMessage-sendButton"]}>
            <h4>Send</h4>
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default WriteAReview;

// import React from 'react';
// import { makeStyles } from '@material-ui/core/styles';
// import Rating from '@material-ui/lab/Rating';
// import Box from '@material-ui/core/Box';

// const labels = {
//   0.5: 'Useless',
//   1: 'Useless+',
//   1.5: 'Poor',
//   2: 'Poor+',
//   2.5: 'Ok',
//   3: 'Ok+',
//   3.5: 'Good',
//   4: 'Good+',
//   4.5: 'Excellent',
//   5: 'Excellent+',
// };

// const useStyles = makeStyles({
//   root: {
//     width: 200,
//     display: 'flex',
//     alignItems: 'center',
//   },
// });

// export default function HoverRating() {
//   const [value, setValue] = React.useState(2);
//   const [hover, setHover] = React.useState(-1);
//   const classes = useStyles();

//   return (
//     <div className={classes.root}>
//       <Rating
//         name="hover-feedback"
//         value={value}
//         precision={0.5}
//         onChange={(event, newValue) => {
//           setValue(newValue);
//         }}
//         onChangeActive={(event, newHover) => {
//           setHover(newHover);
//         }}
//       />
//       {value !== null && <Box ml={2}>{labels[hover !== -1 ? hover : value]}</Box>}
//     </div>
//   );
// }
