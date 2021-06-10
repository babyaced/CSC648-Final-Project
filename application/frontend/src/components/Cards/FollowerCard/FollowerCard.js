import React from 'react'

import styles from './FollowerCard.module.css'

function FollowerCard({ title, src}) {
    return (
        <div className={styles["follower-card"]}>
          <img src={src} className={styles["follower-card-pic"]} />
          <div className={styles["follower-card-name"]}>{title}</div>
        </div>
      );
}

export default FollowerCard
