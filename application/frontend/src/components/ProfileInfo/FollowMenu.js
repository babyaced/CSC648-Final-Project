import React from 'react'
import {Link} from 'react-router-dom'

//Import Icons
import arrow from '../../assets/icons/created/Arrow.svg';

import styles from './FollowMenu.module.css'

function FollowMenu({followingProfileOwnerFlag, profile, onFollowHandler}){

    let dropdownButtonStyle = null;
    followingProfileOwnerFlag === true ? dropdownButtonStyle = styles['unfollow-button'] : dropdownButtonStyle = styles['dropdown-button'];
    return (
        <div style={{position: 'relative'}}>
            <button className={dropdownButtonStyle} onClick={() => onFollowHandler()} >
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <span className={styles['dropdown-button-text']} >
                        {followingProfileOwnerFlag === true ? 'Unfollow' : 'Follow'}
                    </span>
                    <div  >
                        <img src={arrow}/>
                    </div>
                </div>
            </button>
            <ul className={styles['dropdown-items']}>
                <li><Link className={styles['dropdown-item']} to={`/Followers/${profile.profile_id}`}>Followers</Link></li>
            </ul>
        </div>
    )
}

export default FollowMenu
