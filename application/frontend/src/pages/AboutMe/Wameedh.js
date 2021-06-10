import React from 'react'

import styles from './AboutMe.module.css'

import WameedhJpg from '../../assets/images/created/IMG_0109.JPG'



function Cameron() {
    return (
        <div className={styles["about-me-container"]}>
            <div className={styles["about-me-card"]}>
                <span style={{fontSize: '2rem'}}> Hello! My name is Wameedh :)</span><br></br>
                <div className={styles["about-me-body"]}>
                    <p className={styles["wamPara"]}>
                        I am senior Computer Science major student at SFSU. God willing, I will be graduating this semester.
                        People who know me say I am a passionate person. I am an outdoor person. I like hiking and playing soccer.
                        <br></br><br></br>
                        I am originally from Baghdad, Iraq. I came to the USA in 2013.
                        I believe that worshipping God alone is the solution to all our problems so I try to live as such, to the best I could.<br></br><br></br>
                        People who know me say that I am a passionate. I am an outdoor person.
                        I like hiking and playing soccer.
                        I am a motivated person who loves solving problems as I find satisfaction in finding solutions and helping others.<br></br><br></br>
                        Feel free to connect with me on my social media accounts.
                        <br></br>
                        
                    </p>
                    
                        <a href="https://www.linkedin.com/in/wameedh/" className="fa fa-linkedin"></a>
                        <a href="https://www.instagram.com/wameedh.f/" className="fa fa-instagram"></a>
                        <a href="https://twitter.com/Wameedh_F" cl="fa fa-twitter"></a>
                    
                </div>
                <img className={styles["about-me-img"]} src={WameedhJpg}/>
            </div>
            
        </div>
    )
}

export default Cameron
