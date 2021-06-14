import {useState, useEffect, useContext} from 'react'
import {Link, useHistory} from 'react-router-dom'

import styles from './MyPets.module.css'
import axios from 'axios'

import ConfirmDeletion from '../../components/Modals/ConfirmDeletion';

//Import UI Components
import MyPetCard from '../../components/Cards/PetCard/MyPetCard'
import AddAPet from '../../components/Modals/AddAPet';
import Spinner from '../../components/UI/Spinner/Spinner';

import {RedirectPathContext} from '../../context/redirect-path'
import AddPetCard from '../../components/Cards/PetCard/AddPetCard'

function MyPets() {

    const [deletionModalDisplay,setDeletionModalDisplay] = useState(false);
    const [additionModalDisplay, setAdditionModalDisplay] = useState(false);

    const [selectedPet, setSelectedPet] = useState({});


    const [myPets,setMyPets] = useState([]);

    const [typeOptions, setTypeOptions] = useState([]);

    const [dogBreedOptions, setDogBreedOptions] = useState([]);

    const [catBreedOptions, setCatBreedOptions] = useState([]);

    const [colorOptions, setColorOptions] = useState([]);

    const [sizeOptions, setSizeOptions] = useState([]);

    const [ageOptions, setAgeOptions] = useState([]);

    const [loading, setLoading] = useState(false);


    //const redirectContext = useContext(RedirectPathContext);
    const history = useHistory();

    function viewDeletionModal(pet){
        setSelectedPet(pet);
        setDeletionModalDisplay(true);
    }

    function viewAdditionModal(){
        setAdditionModalDisplay(true)
    }

    useEffect(() => {
        setLoading(true);

        const getCurrentUserPets = axios.get('/api/current-user-pets') 
        const getPetTypes = axios.get('/api/pet-types')
        const getDogBreeds = axios.get('/api/dog-breeds')
        const getCatBreeds = axios.get('/api/cat-breeds')
        const getAges = axios.get('/api/ages')
        const getSizes = axios.get('/api/sizes')
        const getColors = axios.get('/api/colors')

        Promise.all([getCurrentUserPets,getPetTypes,getDogBreeds,getCatBreeds,getAges,getSizes,getColors])
        .then(responses =>{
            setMyPets(responses[0].data);
            setTypeOptions(responses[1].data);
            setDogBreedOptions(responses[2].data);
            setCatBreedOptions(responses[3].data);
            setAgeOptions(responses[4].data);
            setSizeOptions(responses[5].data);
            setColorOptions(responses[6].data);
            setLoading(false);
        })
        .catch(err =>{
            console.log(err);
        }) 
    }, [])


    function deletePet(){
        axios.post('/api/delete-pet', {petProfileID: selectedPet.profile_id})
        .then((res)=>{
            setDeletionModalDisplay(false);
        })
        .catch((err) =>{
            console.log(err);
        })
    }


    return (
        <>
            <div className={`${styles['my-pets-container']} ${"container"}`}>
                <div className={styles['my-pets-header']}>
                    <h1>My Pets</h1>
                </div>
                <div className={styles['my-pets-container-pets']}>
                    {loading ? <Spinner/> :        
                        <>
                            <AddPetCard viewAdditionModal={viewAdditionModal}/>
                            {myPets && myPets.map((pet) =>(
                                    <MyPetCard key={pet.profile_id} pet={pet}/>
                                ))
                            }
                        </>}
                </div>
            </div>
            {/* Modals */}
            <ConfirmDeletion display={deletionModalDisplay} onClose={() => setDeletionModalDisplay(false)} selectedPet={selectedPet} deleteAction={deletePet}/>
            <AddAPet 
                display={additionModalDisplay} 
                onClose={() => setAdditionModalDisplay(false)}
                typeOptions={typeOptions} 
                dogBreedOptions={dogBreedOptions} 
                catBreedOptions={catBreedOptions} 
                colorOptions={colorOptions} 
                sizeOptions={sizeOptions} 
                ageOptions={ageOptions}
                // update={() => setUpdate(!update)}
            />
        </>
    )
}

export default MyPets
