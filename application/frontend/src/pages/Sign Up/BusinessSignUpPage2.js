import { useState, useEffect } from 'react';
import {useHistory} from 'react-router'
import {useLocation} from "react-router-dom";
import Axios from 'axios';
import styles from './SignUpPage2.module.css';

import BaseSelect from "react-select";
import FixRequiredSelect from "../../mods/FixRequiredSelect";
import makeAnimated from 'react-select/animated';

//Import Modals
import TermsAndConditions from '../../components/Modals/TermsAndConditions'
import PrivacyPolicy from '../../components/Modals/PrivacyPolicy'

//For address input and suggestions
import {
    Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption,
  } from "@reach/combobox";
  import "@reach/combobox";

import usePlacesAutocomplete,{
getGeocode,
getLatLng,
} from "use-places-autocomplete";

let typeOptions = []; //for storing business type options

//use select with required attribute
const Select = props => (
    <FixRequiredSelect
      {...props}
      SelectComponent={BaseSelect}
      options={props.options || typeOptions}
    />
);

function BusinessSignUpPage2(props) {

    const [typeOptions, setTypeOptions] = useState([]);

    useEffect(() => {  //run once when page loads/refresh
        Axios.get('/api/business-types')   //get business types from database
        .then(response =>{
            setTypeOptions(response.data);
        })
    }, [])
    
    const location = useLocation();
    let state = props.location.state;
    
    const [termsAndConditionsDisplay, setTermsAndConditionsDisplay] = useState(false);
    const [privacyPolicyDisplay, setPrivacyPolicyDisplay] = useState(false);

    const [failedSubmit, setFailedSubmit] = useState(false)

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
        
    }

    const [selectedBusinessType, setSelectedBusinessType] = useState();

    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [latitude, setLatitude] = useState();
    const [longitude, setLongitude] = useState();


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

    const customStyles = {
        control: (base, state) => ({
          ...base,
          height: '37px',
          'min-height': '37px',
          'border-radius': '7.5px',
        }),
    };

    const animatedComponents = makeAnimated();

    const history= useHistory();

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

    function signUpBusiness(event){
        event.preventDefault();
        Axios.post('/api/sign-up/business', { 
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
            type: selectedBusinessType.value
        },{withCredentials:true}).then(response => {
            // if(response.data.affectedRows === 1){
                history.push("/SignUpSuccess");
            // }

        }).catch(error => {
            console.log(error);
        })
    }


    return (
        <>
        <form className={`${styles['signup-container']} ${'small-container'}`}  onSubmit={signUpBusiness}>
            <div className={styles['signup-container-header']}>
                <h2>Business Details</h2>
            </div>
            <div className={styles['signup-fields-container']}>
                    <div className={styles['name-input-container']}>
                        <label className={styles['name-input-label']} for='business-name'>Business Name</label>
                        <input
                            type='text'
                            placeholder='Enter Business Name'
                            name='business-name'
                            required
                            oninvalid={()=>{console.log('')}}
                            onChange={e => setName(e.target.value)}
                        />
                    </div>

                    <div className={styles['phone-number-input-container']}>
                        <label className={styles['phone-number-input-label']} for='business-phone-number'>Phone Number</label>
                        <input
                            type='text'
                            placeholder='(000) 000-0000'
                            name='business-phone-number'
                            required
                            pattern="[0-9]*"
                            maxLength={10}
                            onChange={e => setPhoneNumber(e.target.value)}
                        />
                    </div>

                    <div className={styles['address-input-container']}>
                        <label className={styles['address-input-label']} for='business-address'>Business Address</label>
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
                                placeholder= "Start Typing your Business's Address"
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
                    <label className={styles['types-input-label']} for='business-categories'>Business Categories</label>
                        <Select id="business-type" name="business_type" className={styles['Select']}
                            onChange={setSelectedBusinessType}
                            options={typeOptions}
                            placeholder="Business Type"
                            theme={customTheme}
                            styles={customStyles}
                            isSearchable
                            // isMulti
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

        </form>
        {/* Modals */}
        <TermsAndConditions display={termsAndConditionsDisplay} onClose={() => setPrivacyPolicyDisplay(false)} />
        <PrivacyPolicy display={privacyPolicyDisplay} onClose={() => setTermsAndConditionsDisplay(false)}/>
        </>
    );
}

export default BusinessSignUpPage2;