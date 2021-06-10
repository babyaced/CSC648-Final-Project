import {useState} from 'react'
import {Link} from 'react-router-dom'

//Import Icons
import arrow from '../../assets/icons/created/ArrowWhite.svg';

import styles from './FollowMenu.module.css'

//used to detect if there was a click outside the account menu to close it
import UseClickOutside from '../../utils/UseClickOutside.js'

function FollowMenu({followingProfileOwnerFlag, profile, onFollowHandler}){

    const [menuDisplay, setMenuDisplay] = useState(false)
    let menuClassname
    menuDisplay ? menuClassname = 'menuVisible' : menuClassname = ''

    let domNode = UseClickOutside(()=>{
        setMenuDisplay(false)
    })

    let followButtonStyle = null;
    followingProfileOwnerFlag === true ? followButtonStyle = styles['unfollow-button'] : followButtonStyle = styles['follow-button'];
    return (
        <div className={styles['dropdown-menu-button']} style={{position: 'relative'}}>
            <button className={`${styles['follow-unfollow-button']} ${followButtonStyle}`} onClick={() => onFollowHandler()} >
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <span className={styles['follow-button-text']} >
                        {followingProfileOwnerFlag === true ? 'Unfollow' : 'Follow'}
                    </span>
                </div>
            </button>
            <span ref={domNode}>
                <button className={styles['more-options-button']} onClick={()=> setMenuDisplay(!menuDisplay)}/>
                <ul  className={`${styles['dropdown-items']} ${styles[menuClassname]}`}>
                    <li><Link className={styles['dropdown-item']} to={`/Followers/${profile.profile_id}`}>Followers</Link></li>
                </ul>
            </span>
        </div>
    )
}

export default FollowMenu
