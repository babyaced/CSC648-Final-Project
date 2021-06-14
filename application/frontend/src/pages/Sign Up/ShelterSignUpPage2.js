//React Imports
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import {useLocation} from "react-router-dom";

//Stylesheet Import
import styles from './SignUpPage2.module.css';

//Third Party Component Imports
import BaseSelect from "react-select";
import FixRequiredSelect from "../../mods/FixRequiredSelect";
import makeAnimated from 'react-select/animated';

//Component Imports
import TermsAndConditions from '../../components/Modals/TermsAndConditions'
import PrivacyPolicy from '../../components/Modals/PrivacyPolicy'

//Axios Import
import Axios from 'axios';

//For address input and suggestions display
import {
    Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox";

//For address autocomplete
import usePlacesAutocomplete,{
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";



// let typeOptions = []; //empty pet type options to be populated from database

//Replacing react-select with version that can have required attribute
const Select = props => (  
    <FixRequiredSelect
      {...props}
      SelectComponent={BaseSelect}
      options={props.options}
    />
);


function ShelterSignUpPage2(props) { //recieve form data from sign up page 1

    const [typeOptions, setTypeOptions] = useState([]);

    useEffect(() => {  //run once when page loads/refresh
        Axios.get('/api/pet-types')   //get business types from database
        .then(response =>{
            setTypeOptions(response.data);
        })
    }, [])

    //to get form data from sign up page 1
    const location = useLocation();
    let state = props.location.state;

    //Modal Display States
    const [termsAndConditionsDisplay, setTermsAndConditionsDisplay] = useState(false);
    const [privacyPolicyDisplay, setPrivacyPolicyDisplay] = useState(false);

    //Pet Type Dropdown state
    
    const [selectedPetTypes, setSelectedPetTypes] = useState([]);

    //Form input states
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [latitude, setLatitude] = useState();
    const [longitude, setLongitude] = useState();

     //Use Places Autocomplete call
    const {
        ready, 
        value, 
        suggestions: {status, data}, 
        setValue, 
        clearSuggestions,
    } = usePlacesAutocomplete({
        requestOptions:{
            location: {lat: () => 37.773972,lng: () => -122.431297},
            radius: 200 * 1000,
        },
    });

    //Custom color scheme for react-select
    function customTheme(theme) { //move this a separate file and import maybe?
        return {
            ...theme,
            colors: {
                ...theme.colors,
                primary25: '#B3B3B3',
                primary: '#1CB48F',
            }
        }
    }

    //Custom sizing for react-select
    const customStyles = {
        control: (base, state) => ({
          ...base,
          height: '37px',
          'min-height': '37px',
          'border-radius': '7.5px',
          width: '300px'
        }),
    };
    
    //Modal display Functions
    function openTermsAndConditionsModal() {
        setTermsAndConditionsDisplay(true);
    }

    function closeTermsAndConditionsModal() {
        setTermsAndConditionsDisplay(false);
    }

    function openPrivacyPolicyModal() {
        setPrivacyPolicyDisplay(true);
    }

    function closePrivacyPolicyModal() {
        setPrivacyPolicyDisplay(false);
    }

    const history= useHistory();


    function signUpShelter(event){
        event.preventDefault();
        Axios.post('/api/sign-up/shelter', { 
            email: state.email,
            firstName: state.firstName,
            lastName: state.lastName,
            uname: state.username,
            password: state.password,
            redonePassword: state.redonePassword,
            businessName: name,
            phoneNumber: phoneNumber,
            address: address,
            latitude: latitude,
            longitude: longitude,
            petTypes: selectedPetTypes
        },{withCredentials:true})
        .then(response => {
            if(response.data.affectedRows === 1){
                history.push("/SignUpSuccess");
            }

        })
        .catch(error => {
            console.log(error);
        })
    }

    const animatedComponents = makeAnimated();



    return (
        <>
        <form className={`${styles['signup-container']} ${'small-container'}`}  onSubmit={signUpShelter}>
            <div className={styles['signup-container-header']}>
                <h2>Shelter Details</h2>
            </div>
            <div className={styles['signup-fields-container']}>
                <div className={styles['name-input-container']}>
                    <label className={styles['name-input-label']} for='shelter-name'>Shelter Name</label>
                    <input
                        type='text'
                        placeholder='Enter Shelter Name'
                        name='shelter-name'
                        required
                        onChange={e => setName(e.target.value)}
                    />
                </div>

                <div className={styles['phone-number-input-container']}>
                    <label className={styles['phone-number-input-label']} for='shelter-phone-number'>Phone Number</label>
                    <input
                        type='text'
                        placeholder='(000) 000-0000'
                        name='shelter-phone-number'
                        pattern="[0-9]*"
                        maxLength={10}
                        required
                        onChange={e => setPhoneNumber(e.target.value)}
                    />
                </div>

                <div className={styles['address-input-container']}>
                <label className={styles['address-input-label']} for='shelter-address'>Address</label>
                <Combobox 
                    onSelect={async (address)=>{
                    setValue(address,false);
                    clearSuggestions();
                    try{
                        const results = await getGeocode({address});
                        const{lat,lng} = await getLatLng(results[0]);
                        setLatitude(lat);
                        setLongitude(lng);
                    } catch(error){
                        console.log("error!")
                    }
                        setAddress(address);
                    }}
                >
                    <ComboboxInput 
                        value={value}
                        placeholder= "Start Typing your Shelter's Address"
                        onChange={(e)=> {
                            setValue(e.target.value);
                            //record lat lng to store in database
                        }}
                        required
                        disabled={!ready}
                    />
                    <ComboboxPopover>
                        <ComboboxList className={styles['combobox-list']}>
                            {status === "OK" && data.map(({id,description}) => 
                            <ComboboxOption key={id} value={description}/>

                        )}
                         </ComboboxList>
                    </ComboboxPopover>
                </Combobox>
                </div>

                <div className={styles['types-input-container']}>
                    <label className={styles['types-input-label']} for='shelter-animal-types'>Types of Animals</label>
                    <Select id="shelter-animal-types" name="shelter_animal_types"
                        onChange={setSelectedPetTypes}
                        options={typeOptions}
                        placeholder="Animal Types"
                        theme={customTheme}
                        styles={customStyles}
                        isSearchable
                        isMulti
                        components={animatedComponents}
                        required
                    />
                </div>


            </div>

            <div className={styles['checkbox-container']}>
                <p>By creating an account you agree to our <button className={styles['terms-button']} onClick={openTermsAndConditionsModal}>Terms</button> &<button className={styles['policy-button']} onClick={openPrivacyPolicyModal}>Privacy Policy</button>
                    <label>
                        <input
                            type='checkbox'
                            required name='remember'
                        />
                    </label>
                </p>
            </div>

            <div className={styles['btn-container']}>
                <button type='submit' className={styles['submit-btn']}>Sign Up</button>
            </div>
            {/* Modals */}

        </form>
        <TermsAndConditions display={termsAndConditionsDisplay} onClose={closeTermsAndConditionsModal} />
        <PrivacyPolicy display={privacyPolicyDisplay} onClose={closePrivacyPolicyModal} />
        </>
    );
}

export default ShelterSignUpPage2;