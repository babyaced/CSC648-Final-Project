import React from 'react'

import styles from './AddPetCard.module.css'

import AddIcon from '../../../assets/icons/created/Add.svg'

function AddPetCard({viewAdditionModal}){
    return (
        <div className={styles['add-pet-card']} onClick={() => viewAdditionModal()}>
            <img className={styles['add-pet-card-icon']} src={AddIcon}/>
            <div className={styles['add-pet-card-name']}>Add a Pet</div>
        </div>
    )
}

export default AddPetCard
