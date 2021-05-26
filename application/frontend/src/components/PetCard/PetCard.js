import React from 'react'
import { useHistory } from 'react-router'

//Import CSS
import styles from './PetCard.module.css'

function PetCard({pet}) {
    let history = useHistory();
    return (
        <div className={styles['my-pets-container-pet']} onClick={() => history.push('/Profile/' + pet.profile_id)}>
            <div className={styles.LinkDiv}>
            <img className={styles['my-pets-container-pet-pic']} src={pet.profile_pic_link}/>
            <div className={styles['my-pets-container-pet-name']}>{pet.display_name}</div>
            </div>
        </div>
    )
}

export default PetCard
