import { useContext, useState, useEffect } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';

//css
import arrow from '../../assets/icons/created/Arrow.svg';
import styles from './ProfileInfo.module.css';

//component
import SendProfileMessage from '../../components/Modals/SendProfileMessage';
import EditPetDetails from '../Modals/EditPetDetails';
import EditButton from '../Buttons/EditButton';
import LoginRequired from '../Modals/LoginRequired';


//context
import { RedirectPathContext } from '../../context/redirect-path';

import axios from 'axios';
import ConfirmDeletion from '../Modals/ConfirmDeletion';
import ProfilePic from './ProfilePic';
import FollowMenu from './FollowMenu';
import useTypeOptions from '../DropdownOptions/useTypeOptions';
import useColorOptions from '../DropdownOptions/useColorOptions';
import useAgeOptions from '../DropdownOptions/useAgeOptions';
import useSizeOptions from '../DropdownOptions/useSizeOptions';
import useDogBreedOptions from '../DropdownOptions/useDogBreedOptions';
import useCatBreedOptions from '../DropdownOptions/useCatBreedOptions';

function ProfileInfo({profile, appUser, isSelfView, updateProfile, followingStatus, isAdminView}) {
    const [typeOptions] = useTypeOptions()
    const [colorOptions] = useColorOptions()
    const [ageOptions] = useAgeOptions()
    const [sizeOptions] = useSizeOptions()
    const [dogBreedOptions] = useDogBreedOptions()
    const [catBreedOptions] = useCatBreedOptions()

    const [recievedPetType, setRecievedPetType] = useState();
    const [recievedPetSize, setRecievedPetSize] = useState();
    const [recievedPetAge, setRecievedPetAge] = useState();
    const [recievedPetColors, setRecievedPetColors] = useState();
    const [recievedDogBreeds, setRecievedDogBreeds] = useState();
    const [recievedCatBreeds, setRecievedCatBreeds] = useState();

    useEffect(() => {
        if(typeOptions.length && colorOptions.length && ageOptions.length && sizeOptions.length && dogBreedOptions.length && catBreedOptions.length){
            axios.get('/api/pet-details', {
                params: 
                {
                    petID: profile.pet_id, 
                    typeOptions: typeOptions, 
                    colorOptions: colorOptions, 
                    ageOptions: ageOptions, 
                    sizeOptions: sizeOptions, 
                    dogBreedOptions: dogBreedOptions, 
                    catBreedOptions: catBreedOptions}})
            .then(response =>{
                console.log(response);
                setRecievedPetAge(JSON.parse(response.data.petAge));
                setRecievedPetSize(JSON.parse(response.data.petSize));
                setRecievedPetType(JSON.parse(response.data.petType));

                let parsedPetColors = []
                for(const petColor of response.data.colors){
                    parsedPetColors.push(JSON.parse(petColor));
                }

                let parsedDogBreeds = []
                for(const dogBreed of response.data.dogBreeds){
                    parsedDogBreeds.push(JSON.parse(dogBreed));
                }

                let parsedCatBreeds = []
                for(const catBreed of response.data.catBreeds){
                    parsedCatBreeds.push(JSON.parse(catBreed));
                }

                console.log(parsedPetColors)
                setRecievedPetColors(parsedPetColors);
                setRecievedDogBreeds(parsedDogBreeds);
                setRecievedCatBreeds(parsedCatBreeds);
                
                
            })
            .catch(err =>{
                console.log(err);
            })
        }
      
    }, [typeOptions, colorOptions, ageOptions, sizeOptions,dogBreedOptions,catBreedOptions])

    const [editing, setEditing] = useState(false);
    
    const [follow, setFollow] = useState(followingStatus); // update this from backend

    const [petType, setPetType] = useState({});
    const [petBreeds, setPetBreed] = useState([{}]);

    const [sendAMessageDisplay,setSendAMessageDisplay] = useState(false);
    const[editPetDetailsDisplay, setEditPetDetailsDisplay] = useState(false);
    const [loginRequiredDisplay, setLoginRequiredDisplay] = useState(false);
    const [deletionModalDisplay, setDeletionModalDisplay] = useState(false);

    const history = useHistory();
    const location = useLocation();

    const redirectContext = useContext(RedirectPathContext);

    const [displayName, setDisplayName] = useState(profile.display_name);

    const [profileType, setProfileType] = useState(profile.type);
    
    function editHandler(){
        profileType === 'Pet' ?
        setEditPetDetailsDisplay(true) :
        setEditing(true);
    }

    function cancelEditHandler() {
        axios.post('/api/name',{
            newFirstName: displayName
        })
        .then((res) =>{
        })

        setEditing(false);
    }

    function sendAMessage(){
        if(appUser){
            setSendAMessageDisplay(true);
        }
        else{
            setLoginRequiredDisplay(true);
        }
    }

    function banUser(){
        axios.post('/api/ban-user',{
            profileID: profile.profile_id
        })
        .then((res) =>{
            setDeletionModalDisplay(false);
            history.push('/Feed')
        })
        .catch((err) =>{
            console.log(err)
        })
    }

    function onFollowHandler() {
        if(appUser){
            axios.post('/api/follow-unfollow-user',{
                accountId: profile.account_id
            })
            setFollow(!follow);
        }
        else{
            setLoginRequiredDisplay(true);
        }
    }

    let nameDisplay = null;
    let buttons = null;
    switch(profileType) {
        case 'Shelter' :
        case 'Business' :
        case 'PetOwner' :
            buttons = (
                <>
                    {!isSelfView ? (
                        <FollowMenu followingProfileOwnerFlag={follow} profile={profile} onFollowHandler={onFollowHandler}/>
                        ):
                        (
                            <button className={styles.Button} onClick={() => history.push(`/Followers/${profile.profile_id}`)} >Followers</button>
                        )
                    }
                    {!isSelfView && <button className={styles.Button} onClick={sendAMessage} >Message</button>}
                </>
            )
            break;
        case 'Pet':
            nameDisplay = (
                <>
                    <div style={{display: 'flex'}} >
                        <h1 className={styles.UserName}>{displayName}</h1>
                        {/* <h3 style={{marginLeft: '10px'}} >
                            {petType.value ? petType.value : 'Type'}
                            /
                            {petBreeds[0].value ? petBreeds[0].value : 'Breed'}
                        </h3> */}
                    </div>
                   
                </>
            )
            buttons = (
                <>
                    {!isSelfView ? (
                         <FollowMenu followingProfileOwnerFlag={follow} profile={profile} onFollowHandler={onFollowHandler}/>
                        ):
                        (   
                            <button className={styles.Button} onClick={() => history.push(`/Followers/${profile.profile_id}`)}>Followers</button>
                        )
                    }
                    {!isSelfView &&
                    <>
                        <button className={styles.Button} onClick={() => history.push("/Profile/" + profile.reg_user_id)} >My Owner</button>
                        <button className={styles.Button} onClick={sendAMessage}>Message</button>
                    </>}
                </>
            )
            break;
        default:
            buttons = null;
    }

    return (
        <div className={styles['profile-header']} >
            <div className={styles['profile-pic-container']}>
                <ProfilePic isSelfView={isSelfView} profile={profile}/>
            </div>
            <div className={styles['display-name-container']}>
                <h1 className={styles['display-name']} >
                    <input value={displayName} readOnly={!editing} maxLength = "25" onChange={event => setDisplayName(event.target.value)}/>
                </h1> 

            </div>
            <div className={styles['save-edit-button-wrapper']}>
                {isSelfView && !editing &&
                    <EditButton style={{fontSize: 'var(--h5)'}} edit clicked={() => editHandler()}>Edit</EditButton>
                }
                {
                    isSelfView && editing && 
                    <EditButton style={{fontSize: 'var(--h5)'}} save clicked={cancelEditHandler}>Save</EditButton>
                }
            </div>
            <div className={styles['button-container']} >
                {buttons}
                {isAdminView && !isSelfView && <button className={styles['ban-button']} onClick={()=>setDeletionModalDisplay(true)}>Ban User</button>}
            </div>
            
            {/* Modals */}
            {profileType == 'Pet' &&  
                <EditPetDetails 
                    display={editPetDetailsDisplay} 
                    updateProfile={updateProfile} 
                    profile={profile} 
                    onClose={()=> setEditPetDetailsDisplay(false)}
                    updatePetType={setPetType}
                    updatePetBreed={setPetBreed}
                    recievedPetAge={recievedPetAge}
                    recievedPetSize={recievedPetSize}
                    recievedPetType={recievedPetType}
                    recievedPetColors={recievedPetColors}
                    recievedDogBreeds={recievedDogBreeds}
                    recievedCatBreeds={recievedCatBreeds}
                />
            }
            <SendProfileMessage 
                display={sendAMessageDisplay} 
                profile={profile} 
                onClose={()=> setSendAMessageDisplay(false)}
            />
            <LoginRequired 
                display={loginRequiredDisplay} 
                onClose={() =>setLoginRequiredDisplay(false)} 
                redirect={location.pathname}
            />
            <ConfirmDeletion 
                display={deletionModalDisplay} 
                onClose={() => setDeletionModalDisplay(false)} 
                message={'Ban ' + profile.display_name +"'s account ?"} deleteAction={banUser}
            /> 
        </div>
    );
}

export default ProfileInfo;