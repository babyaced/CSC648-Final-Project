import React from 'react'

import styles from './AboutMe.module.css'

import EmJPG from '../../assets/images/created/Em.jpg'


function Em() {
    return (
        <div className={styles["about-me-container"]}>
        <div className={styles["about-me-card"]}>
            <span className={styles["about-me-header"]}>Self-Introduction.</span><br></br>
            <div className={styles["about-me-body"]}>
                <p>
                    I am a senior in my last semester at San Francisco State studying Computer Science.
		    I enjoy designing useful software and teaching computer science. In my spare time, I
		    hike, learn about history, and write.
                </p>
            </div>
            <img className={styles["about-me-img"]} src={EmJPG}/>
        </div>
    </div>
    )
}

export default Em
