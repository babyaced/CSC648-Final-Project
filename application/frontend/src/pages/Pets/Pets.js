import {useState, useEffect} from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'

import styles from './MyPets.module.css'  //same style as my pets without add pet button

import AddIcon from '../../images/Created Icons/Add.svg'
import Spinner from '../../components/UI/Spinner/Spinner';

import axios from 'axios'
function Pets() {

    const {profileID} = useParams(); 

    const [pets,setPets] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() =>{
        setLoading(true)
        axios.get('/api/pets',{params:{profileID}})
        .then(response =>{
            setPets(response.data);
            setLoading(false);
        })
        .catch(err =>{
        })
    },[profileID])

    

    let history = useHistory();

    return (
        <>
        {loading && <Spinner/>}
        {!loading && <div className={`${styles['my-pets-container']} ${"container"}`}>
            <div className={styles['my-pets-header']}>
                Pets
                <span onClick={() => history.goBack()} >Back to Profile</span>
            </div>
            <div className={styles['my-pets-container-pets']}>
                {pets.length == 0 && <div className={styles['my-pets-container-no-pets']}>This User has No Pets :(</div>}
                {pets && pets.map((pet) =>(
                    <div className={styles['my-pets-container-pet']} onClick={() => history.push('/Profile/' + pet.profile_id)}>
                        <div className={styles.LinkDiv}>
                        <img className={styles['my-pets-container-pet-pic']} src={pet.profile_pic_link}/>
                        <div className={styles['my-pets-container-pet-name']}>{pet.display_name}</div>
                        </div>
                    </div>
                    
                ))}
            </div>
        </div>}
        </>
    )
}

export default Pets
