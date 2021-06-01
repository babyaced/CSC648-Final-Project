import { useContext, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';

//css
import arrow from '../../images/Arrow.png';
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

function ProfileInfo({profile, appUser, isSelfView, updateProfile, followingStatus, isAdminView}) {

    //image upload array
    
    //const [profile.profile_pic_link, setprofile.profile_pic_link] = useState('');
    //const [profileTitle, setProfileTitle] = useState('');
    const [editing, setEditing] = useState(false);
    
    const [follow, setFollow] = useState(followingStatus); // update this from backend
    // const [showBackdrop, setShowBackdrop] = useState(false);

    const [petType, setPetType] = useState({});
    const [petBreeds, setPetBreed] = useState([{}]);
    // const [petColors, setPetColors] = useState([]);
    // const [petSize, setPetSize] = useState();

    const [sendAMessageDisplay,setSendAMessageDisplay] = useState(false);
    const[editPetDetailsDisplay, setEditPetDetailsDisplay] = useState(false);
    const [loginRequiredDisplay, setLoginRequiredDisplay] = useState(false);
    const [deletionModalDisplay, setDeletionModalDisplay] = useState(false);

    const history = useHistory();
    const location = useLocation();

    const redirectContext = useContext(RedirectPathContext);

    const [displayName, setDisplayName] = useState(profile.display_name);

    const [profileType, setProfileType] = useState(profile.type);
    
    function openEditModal(){
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
    let displayAccountInfo = null;
    let dropdownButtonStyle = null;
    follow === true ? dropdownButtonStyle = styles.UnfollowButton : dropdownButtonStyle = styles.DropdownButton;
    switch(profileType) {
        case 'Shelter' :
            nameDisplay = (
                <h1 className={styles.UserName} >
                    <input 
                        value={displayName} 
                        readOnly={!editing}
                        maxLength = "25"
                        onChange={event => updateProfile('userName', event.target.value)} 
                    />
                </h1> 
            )
            displayAccountInfo = (
                <div className={styles.ButtonContainer} >
                    {!isSelfView ? (
                        <div style={{position: 'relative'}}>
                            <button className={dropdownButtonStyle} onClick={() => onFollowHandler()} >
                                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                    <span className={styles.DropdownText} >
                                        {follow === true ? 'Unfollow' : 'Follow'}
                                    </span>
                                    <div  >
                                        <img src={arrow} />
                                    </div>
                                </div>
                            </button>
                            <ul className={styles.DropdownContent}>
                                <li><Link className={styles.DropdownItem} to={`/Followers/${profile.profile_id}`}>Followers</Link></li>
                            </ul>
                        </div>
                        ):
                        (
                            <button className={styles.FristButton} onClick={() => history.push(`/Followers/${profile.profile_id}`)} >Followers</button>
                        )
                    }
                    {!isSelfView && <button className={styles.Button} onClick={sendAMessage} >Message</button>}
                </div>
            )
            break;
        case 'Business' :
            nameDisplay = (
                <h1 className={styles.UserName} >
                    <input 
                        value={displayName} 
                        readOnly={!editing}
                        maxLength = "25"
                        onChange={event => updateProfile('userName', event.target.value)} 
                    />
                </h1> 
            )
            displayAccountInfo = (
                <div className={styles.ButtonContainer} >
                    {!isSelfView ? (
                        <div style={{position: 'relative'}}>
                            <button className={dropdownButtonStyle} onClick={() => onFollowHandler()} >
                                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                    <span className={styles.DropdownText} >
                                        {follow === true ? 'Unfollow' : 'Follow'}
                                    </span>
                                    <div  >
                                        <img src={arrow} />
                                    </div>
                                </div>
                            </button>
                            <ul className={styles.DropdownContent}>
                                <li><Link className={styles.DropdownItem} to={`/Followers/${profile.profile_id}`}>Followers</Link></li>
                            </ul>
                        </div>                       
                        ):
                        (
                            <button className={styles.FristButton} onClick={() => history.push(`/Followers/${profile.profile_id}`)} >Followers</button>
                        )
                    }
                    {!isSelfView && <button className={styles.Button} onClick={sendAMessage} >Message</button>}
                </div>
                
            )
            break;
        case 'PetOwner' :
            nameDisplay = (
                <h1 className={styles.UserName} >
                    <input 
                        value={displayName} 
                        readOnly={!editing}
                        maxLength = "25"
                        onChange={event => setDisplayName(event.target.value)} 
                    />
                </h1> 
            )
            displayAccountInfo = (
                <div className={styles.ButtonContainer} >
                    {!isSelfView ? (
                        <div style={{position: 'relative'}}>
                            <button className={dropdownButtonStyle} onClick={() => onFollowHandler()} >
                                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                    <span className={styles.DropdownText} >
                                        {follow === true ? 'Unfollow' : 'Follow'}
                                    </span>
                                    <div  >
                                        <img src={arrow} />
                                    </div>
                                </div>
                            </button>
                            <ul className={styles.DropdownContent}>
                                <li><Link className={styles.DropdownItem} to={`/Followers/${profile.profile_id}`}>Followers</Link></li>
                            </ul>
                        </div>
                        ):
                        (
                            <button className={styles.FristButton} onClick={() => history.push(`/Followers/${profile.profile_id}`)}>Followers</button>
                        )
                    }
                    {!isSelfView && <button className={styles.Button} onClick={sendAMessage} >Message</button>}
                </div>
            )
            break;
        case 'Pet':
            nameDisplay = (
                <>
                    <div style={{display: 'flex'}} >
                        <h1 className={styles.UserName}>{displayName ? displayName : 'Name of Your Pet'}</h1>
                        {/* <h3 style={{marginLeft: '10px'}} >
                            {petType.value ? petType.value : 'Type'}
                            /
                            {petBreeds[0].value ? petBreeds[0].value : 'Breed'}
                        </h3> */}
                    </div>
                    <EditPetDetails 
                        display={editPetDetailsDisplay} 
                        updateProfile={updateProfile} 
                        profile={profile} 
                        onClose={()=> setEditPetDetailsDisplay(false)}
                        updatePetType={setPetType}
                        updatePetBreed={setPetBreed}
                    />
                </>
            )
            displayAccountInfo = (
                <div className={styles.ButtonContainer} >
                    {!isSelfView ? (
                        <div style={{position: 'relative'}}>
                            <button className={dropdownButtonStyle} id="dropdownButton" onClick={() => onFollowHandler()} >
                                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                    <span className={styles.DropdownText}>
                                        {follow === true ? 'Unfollow' : 'Follow'}
                                    </span>
                                    <div  >
                                        <img src={arrow} />
                                    </div>
                                </div>
                            </button>
                            <ul className={styles.DropdownContent}>
                                <li><Link className={styles.DropdownItem} to={`/Followers/${profile.profile_id}`}>Followers</Link></li>
                                <li><Link className={styles.DropdownItem} to={"/Profile/" + profile.reg_user_id}>My Owner</Link></li>
                            </ul>
                        </div>
                        ):
                        (   
                            <>
                                <button className={styles.FristButton} onClick={() => history.push(`/Followers/${profile.profile_id}`)}>Followers</button>
                                <button className={styles.Button} onClick={() => history.push("/Profile/" + profile.reg_user_id)} >My Owner</button>
                            </>
                        )
                    }
                    {!isSelfView && <button className={styles.Button} onClick={sendAMessage}>Message</button>}
                </div>
            )
            break;
        default:
            displayAccountInfo = null;
    }

    return (
        <div className={styles.ProfileInfo} >
            <ProfilePic isSelfView={isSelfView} profile={profile}/>
            <div className={styles.SideContainer} >
                <div className={styles['SideContainer-nameDiv']}>
                    {
                        isSelfView && !editing && profileType !== 'Pet' &&
                        <EditButton 
                            style={{
                                alignSelf: 'center',
                                fontSize: '1.5em',
                                height: '50%',
                                outline: 'none'
                            }} 
                            edit 
                            clicked={() => openEditModal()}
                        >
                            Edit
                        </EditButton>
                    }
                    {nameDisplay}
                    {
                        isSelfView && editing && 
                        //<button className={styles.EditButton} onClick={cancelEditHandler}  >confirm</button>
                        <EditButton 
                            style={{
                                alignSelf: 'center',
                                fontSize: '1.5em',
                                height: '50%',
                                outline: 'none'
                            }} 
                            save 
                            clicked={cancelEditHandler}
                        >
                            Save
                        </EditButton>
                    }
                </div>
                <div className={styles['SideContainer-contaniner']}>
                {displayAccountInfo}
                {isAdminView && !isSelfView && <button className={styles['ban-button']} onClick={()=>setDeletionModalDisplay(true)}>Ban User</button>}
                </div>
            </div>
            <SendProfileMessage display={sendAMessageDisplay} profile={profile} onClose={()=> setSendAMessageDisplay(false)}/>
            <LoginRequired display={loginRequiredDisplay} onClose={() =>setLoginRequiredDisplay(false)} redirect={location.pathname}/>
            <ConfirmDeletion display={deletionModalDisplay} onClose={() => setDeletionModalDisplay(false)} message={'Ban ' + profile.display_name +"'s account ?"} deleteAction={banUser}/> 
        </div>
    );
}

export default ProfileInfo;