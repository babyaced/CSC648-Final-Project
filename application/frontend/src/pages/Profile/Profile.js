import { useContext, useEffect, useState } from 'react';
import {useHistory, useLocation, useParams} from 'react-router-dom';

// Import components
import ProfileInfo from '../../components/ProfileInfo/ProfileInfo'
import ProfileContent from '../../components/ProfileContent/ProfileContent';
import AboutMe from '../../components/AboutMe/AboutMe';
import Spinner from '../../components/UI/Spinner/Spinner';
import { RedirectPathContext } from '../../context/redirect-path';

import styles from './Profile.module.css'
import axios from 'axios';

function Profile({appUser}) {

    const [fetchedProfile,setFetchedProfile] = useState({});
    const [fetchedPhotoPosts, setFetchedPhotoPosts] = useState([]);
    const [fetchedPets, setFetchedPets] = useState([]);
    const [taggedPosts, setTaggedPosts] = useState([]);
    const [fetchedHours, setFetchedHours] = useState([]);
    const [fetchedAddress, setFetchedAddress] = useState([]);
    const [fetchedPhoneNumber, setFetchedPhoneNumber] = useState('');

    const [followingStatus, setFollowingStatus] = useState('');

    const redirectContext = useContext(RedirectPathContext);

    const {profileID} = useParams();

    const [userProfile, setUserProfile] = useState();
    const [selfView, setSelfView] = useState(false);
    const [adminView,setAdminView] = useState(false);

    const history = useHistory()

    useEffect(() =>{
        redirectContext.updateLoading(true);

        const getProfile = axios.get('/api/profile',{params: {profileID: profileID}})
        const getPhotoPosts = axios.get('/api/photo-posts',{params: {profileID: profileID}})
        const getCurrentUserPets = axios.get('/api/pets',{params: {profileID: profileID}})
        const getTaggedPosts = axios.get('/api/tagged-posts',{params: {profileID: profileID}})
        const getIsFollowing = axios.get('/api/is-following',{params: {profileID: profileID}})

        Promise.all([getProfile,getPhotoPosts, getCurrentUserPets,getTaggedPosts, getIsFollowing])
        .then((responses) =>{
            if(!responses[0].data.profile){ //if the profile doesn't exist, redirect user
                history.push('/Feed')
            }
            setFetchedProfile(responses[0].data.profile)
            setSelfView(responses[0].data.selfView)
            setAdminView(responses[0].data.adminView)
            setFetchedPhotoPosts(responses[1].data)
            setFetchedPets(responses[2].data)
            setTaggedPosts(responses[3].data)
            setFollowingStatus(responses[4].data)
            redirectContext.updateLoading(false);
        })
        .catch((err) =>{
            redirectContext.updateLoading(false);
            //display error message to user
        })
    },[profileID])

    
    // switch profile type by changing the userProfile Ex: shelterProfile, businessProfile, newBusinessProfile and petOwnerProfile

    function updateProfileHandler(type, value) {
        if (type === 'address' || type === 'phone' || type === 'hours') {
            setUserProfile(() => ({
                ...userProfile,
                contactInfo: {
                ...userProfile.contactInfo,
                [type]: value
                }
            }));
        }
        else {
            setUserProfile(() => ({
                ...userProfile,
                [type]: value
            }));
        }
    }

    function toggleSelfViewHandler() {
        setSelfView(!selfView);
        let button = document.getElementById('profile-button'); // Maybe change the ID name to somthing more specific - Wameedh
        selfView ? button.className = styles.SwitchSelf : button.className = styles.SwitchVistor;
    }


    let displayProfile = <Spinner />

    if (!redirectContext.loading){
        displayProfile = (
            <>
                <ProfileInfo 
                    appUser={appUser} 
                    isSelfView={selfView} 
                    profile={fetchedProfile}
                    updateProfile={updateProfileHandler}
                    followingStatus={followingStatus}
                    isAdminView={adminView}
                />
                <div className={styles.Bottom}>
                    <AboutMe
                        aboutMeBody={fetchedProfile.about_me}
                        hours={fetchedHours}
                        phoneNumber={fetchedPhoneNumber}
                        address={fetchedAddress}
                        isSelfView={selfView} 
                        profile={fetchedProfile} 
                        profileID={profileID}
                        updateProfile={updateProfileHandler}
                    />
                    <ProfileContent
                        photoPosts={fetchedPhotoPosts}
                        taggedPosts={taggedPosts}
                        pets={fetchedPets}
                        isSelfView={selfView} 
                        profile={fetchedProfile} 
                        updateProfile={updateProfileHandler} 
                    />
                </div>
            </>
        );
    }

    return (
        <div className={`${styles["Profile"]} ${"wide-container"}`} >
            {displayProfile}
        </div>
    )
}

export default Profile;