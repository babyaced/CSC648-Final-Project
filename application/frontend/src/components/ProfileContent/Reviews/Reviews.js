import React, { useEffect } from "react";

// import Rating from '@material-ui/lab/Rating';
// import Box from '@material-ui/core/Box';

import styles from "./Reviews.module.css";

// const reviews = [
//     {
//        user_id: 1,
//        review: "I saw this on TV and wanted to give it a try. one of my hobbies is web-browsing. and when i'm browsing the web this works great.",
//        rating: 3
//     },
//     {
//         user_id: 2,
//         review: 'It\'s a good place',
//         rating: 4
//     },
//     {
//         user_id: 3,
//         review: 'My neighbor Georgie has one of these. She works as a busboy and she says it looks brown.',
//         rating: 5
//     },
//     {
//         user_id: 4,
//         review: 'I saw one of these in Canada and I bought one. My ant loves to play with it.',
//         rating: 4.5
//     }
// ]

function Reviews(props) {
  let displayReviews = null;
  if (props.reviews.length !== 0) {
    displayReviews = props.reviews
      .slice(
        props.reviews.length - 3 >= 0 ? props.reviews.length - 3 : 0,
        props.reviews.length
      )
      .map((ele) => (
        // <Box
        //     key={ele.user_id}
        //     className={styles.Reviews}
        //     component="fieldset" mb={3}
        //     borderColor="transparent"
        // >
        <textarea
          rows="4"
          cols="8"
          readOnly
          value={ele.review}
          style={{ textAlign: "center" }}
        />
        /* <Rating 
                        name="read-only" 
                        value={ele.rating} 
                        precision={0.5} 
                        readOnly 
                        style={{float: 'right', paddingLeft: '15px', color: '#1CB48F' }} 
                    /> */
        // </Box>
      ));
  } else {
    displayReviews = (
      <div className={styles.EmptyReviews}>
        <h2>Don't have any reviews yet</h2>
      </div>
    );
  }

  return <div className={styles.Container}>{displayReviews}</div>;
}

export default Reviews;
