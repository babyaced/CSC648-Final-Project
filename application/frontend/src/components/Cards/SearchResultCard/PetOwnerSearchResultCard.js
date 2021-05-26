//Import Libraries
import React from 'react'
import {Link} from 'react-router-dom'

//Import CSS
import styles from './SearchResultCard.module.css'

function PetOwnerSearchResultCard({searchResult}) {
    return (
        <li className={styles['search-result']}>
            <img className={styles['search-result-pic']} src={searchResult.profile_pic_link}/>
            <Link className={styles['profile-link']} to={"/Profile/" + searchResult.profile_id}>
                <span className={styles['search-result-name']}>{searchResult.display_name}</span>
            </Link>
        </li>
    )
}

export default PetOwnerSearchResultCard
