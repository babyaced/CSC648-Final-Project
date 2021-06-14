import React from 'react'
import {useHistory} from 'react-router-dom'

import styles from './PetCard.module.css'

//Import Icons
import DeleteIcon from  '../../../assets/icons/created/Exit-Cancel.svg'

function MyPetCard({pet, viewDeletionModal}) {
    const history = useHistory();
    return (
        <div className={styles['my-pet-card']} >
            <div className={styles['my-pet-card-link']} onClick={() => history.push('/Profile/' + pet.profile_id)}>
                <img className={styles['my-pet-card-profile-pic']} src={pet.profile_pic_link}/>
                <div className={styles['my-pet-card-name']}>{pet.display_name}</div>
            </div>
            {/* <img className={styles['my-pet-card-delete']} onClick={()=>viewDeletionModal()}src={DeleteIcon}/> */}
        </div>
    )
}

export default MyPetCard
