import React from 'react'
import { useHistory } from 'react-router'

import CheckMark from '../../assets/images/thirdparty/undraw_checkbox.svg'

import styles from './SignUpPage.module.css'

function SignUpSuccess() {
    const history= useHistory();

    function OnClickHandler(){
        history.push('/login-page')
    }


    return (
        <div className={styles['signup-container']}>
            <img className={styles['signup-container-check']} src={CheckMark}/>
            <div className={styles['signup-container-header']}>
                Your Account was Successfully Created! You can now Login
            </div>
            <div className={styles['btn-container']}>
                <button type='submit' className={styles['submit-btn-2']} onClick={OnClickHandler}>Login</button>
            </div>
        </div>
    )
}

export default SignUpSuccess
