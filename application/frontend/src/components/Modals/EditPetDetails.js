import {useState, useEffect} from 'react'

import Modal from './Modal'

import Select from 'react-select';

import makeAnimated from 'react-select/animated';

import styles from './EditPetDetails.module.css'
import axios from 'axios';

import SelectCustomTheme from '../../mods/SelectCustomTheme'

import useTypeOptions from '../DropdownOptions/useTypeOptions'
import useColorOptions from '../DropdownOptions/useColorOptions'
import useAgeOptions from '../DropdownOptions/useAgeOptions'
import useSizeOptions from '../DropdownOptions/useSizeOptions'
import useCatBreedOptions from '../DropdownOptions/useCatBreedOptions'
import useDogBreedOptions from '../DropdownOptions/useDogBreedOptions'

function EditPetDetails({display, updateProfile, profile, onClose, updatePetType, updatePetBreed, recievedPetAge, recievedPetSize, recievedPetType, recievedPetColors, recievedDogBreeds, recievedCatBreeds}) {

    console.log(recievedPetAge)
    console.log(recievedPetSize)
    console.log(recievedPetType)
    console.log(recievedPetColors)
    console.log(recievedDogBreeds)
    console.log(recievedCatBreeds)

    const [petName, setPetName] = useState('');
    const [petType,setPetType] = useState([]);  //set this to already existing pet type stored in db for real version
    const [dogBreed, setDogBreed] = useState([]);
    const [petColors, setPetColors] = useState([]);
    const [petSize, setPetSize] = useState([]);
    const [catBreed, setCatBreed] = useState([]);
    const [petAge, setPetAge] = useState([]); 


    const [typeOptions] = useTypeOptions()

    const [dogBreedOptions] = useDogBreedOptions()

    const [catBreedOptions] = useCatBreedOptions()

    const [colorOptions] = useColorOptions();

    const [sizeOptions] = useSizeOptions();

    const [ageOptions] = useAgeOptions();

    //function updatePet(){
    //     axios.post('/api/edit-pet',{})
    //     .then((response) =>{

    //     })
    //     .catch((err) =>{

    //     })
    // }
    
    const animatedComponents = makeAnimated();

    return (
        <Modal display={display} onClose={onClose}>
            <div className={styles['edit-pet-details-header']}>Edit Pet Information</div>
            <div className={styles['edit-pet-details-container']}>
                <div className={styles['edit-pet-details-name']}>
                    <label for="name">Name</label>
                    <input 
                        type="text" 
                        id="name" 
                        name="pet_name" 
                        maxLength="25"
                        value={profile.display_name}
                        placeholder="Name"
                        onChange={event => updateProfile('userName', event.target.value)} />
                </div>
                <div className={styles['edit-pet-details-type']}>
                    <label for="type">Type</label>
                    <Select id="type" name="pet_type"
                        onChange={updatePetType}
                        options= {typeOptions}
                        theme={SelectCustomTheme}
                        value={recievedPetType}
                        placeholder="Select Pet Type"
                        isSearchable
                    />
                </div>
                <div className={styles['edit-pet-details-breed']}>
                    <label for="breed">Breed</label>
                    <Select id="breed" name="pet_breed"
                        onChange={updatePetBreed}
                        options={dogBreedOptions}
                        theme={SelectCustomTheme}
                        placeholder="Select Dog Breed"
                        isSearchable
                        isMulti
                        // value = pet breed
                        components={animatedComponents}
                    />
                </div>
                <div className={styles['edit-pet-details-color']}>
                    <label for="color">Color(s)</label>
                    <Select id="color" name="pet_color"
                        onChange={setPetColors}
                        options={colorOptions}
                        theme={SelectCustomTheme}
                        placeholder="Select Pet Color(s)"
                        isSearchable
                        value={recievedPetColors}
                        isMulti
                    />
                </div>
                <div className={styles['edit-pet-details-age']}>
                        <label for="age">Age</label>
                        <Select id="age" name="pet_age"
                            onChange={setPetAge}
                            options={ageOptions}
                            theme={SelectCustomTheme}
                            value={recievedPetAge}
                            placeholder="Select Pet Age"
                            isSearchable
                        />
                </div>
                <div className={styles['edit-pet-details-size']}>
                    <label for="size">Size</label>
                    <Select id="size" name="pet_size"
                        onChange={setPetSize}
                        options={sizeOptions}
                        theme={SelectCustomTheme}
                        placeholder="Select Pet Size"
                        value={recievedPetSize}
                        isSearchable
                    />
                </div>
                <div className={styles['edit-pet-details-breed']}>
                        <label for="breed">Breed</label>
                        <Select id="breed" name="pet_breed"
                            // onChange={updatePetBreed}
                            onChange={setDogBreed}
                            options={dogBreedOptions}
                            theme={SelectCustomTheme}
                            placeholder="Select Dog Breed"
                            isSearchable
                            isMulti
                            value={recievedDogBreeds}
                            components={animatedComponents}
                        />
                    </div>
                {petType && petType.label === 'Cat' && <div className={styles['edit-pet-details-breed']}>
                    <label for="breed">Breed</label>
                    <Select id="breed" name="pet_breed"
                        // onChange={updatePetBreed}
                        onChange={setCatBreed}
                        options={ catBreedOptions()}
                        theme={SelectCustomTheme}
                        placeholder="Select Cat Breed"
                        isSearchable
                        isMulti
                        value={recievedCatBreeds}
                        components={animatedComponents}
                    />
                </div>}
                <button className={styles['edit-pet-details-submit']} onClick={onClose}>Submit</button>
            </div>
        </Modal>
    )
}

export default EditPetDetails
