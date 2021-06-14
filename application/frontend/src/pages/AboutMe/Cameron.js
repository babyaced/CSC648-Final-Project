import React from 'react'

import styles from './AboutMe.module.css'

import CameronJpg from '../../assets/images/created/Cameron.jpg'

function Cameron() {
    return (
        <div className={styles["about-me-container"]}>
            <div className={styles["about-me-card"]}>
                <span className={styles["about-me-header"]}>Hello! My name is Cameron Harte</span><br></br>
                <div className={styles["about-me-body"]}>
                    <p>
                        I am a senior at SFSU studying Computer Science! My hobbies include playing video games, reading comics, listening to music, taking photos of my cat Yoshi, and traveling.
                    </p>
                    <p> 
                        I have a passion for learning new technologies and finding creative solutions and look forward to learning everything I can about game development to be ready for a career in the Game Industry!
                    </p>
                </div>
                <img className={styles["about-me-img"]} src={CameronJpg}/>
            </div>
        </div>
    )
}

export default Cameron
