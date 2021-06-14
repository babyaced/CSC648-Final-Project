import React from 'react'
import { useHistory } from 'react-router'

//Import CSS
import styles from './PetCard.module.css'

function PetCard({pet}) {
    let history = useHistory();
    return (
        <div className={styles['pet-card']} onClick={() => history.push('/Profile/' + pet.profile_id)}>
            <div className={styles['pet-card-link']}>
                <img className={styles['pet-card-profile-pic']} src={pet.profile_pic_link}/>
                <div className={styles['pet-card-name']}>{pet.display_name}</div>
            </div>
        </div>
    )
}

export default PetCard
