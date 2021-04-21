import React, { useEffect, useState } from 'react';

// Import components
import ProfileInfo from '../../components/ProfileInfo/ProfileInfo'
import ProfileContent from '../../components/ProfileContent/ProfileContent';
import AboutMe from '../../components/AboutMe/AboutMe';
import SendAMessage from '../../components/Modals/SendAMessage';


import styles from './Profile.module.css'

const petOwnerProfile = {
    accountType: 'pet owner',
    id: '3',
    userName: 'Alex',
    userPicture: 'petOwnerImage',
    about: 'Hello, I\'m Alex.',
    photos: [
        {   pet_id: 3,
            name: 'Juju',
            size_name: 'larg',
            age_name: 'ten',
            profile_pic: 'https://csc648groupproject.s3-us-west-2.amazonaws.com/JujuPic.jpg' 
        },
        {   pet_id: 2,
            name: 'Max',
            size_name: 'small',
            age_name: 'two',
            profile_pic:'https://csc648groupproject.s3-us-west-2.amazonaws.com/MaxPic.jpg'
        },
        { pet_id: 1,
            name: 'Mimi',
            size_name: 'medium',
            age_name: 'six',
            profile_pic: 'https://csc648groupproject.s3-us-west-2.amazonaws.com/MimiPic.jpg' 
        },
        {   pet_id: 4,
            name: 'Juju',
            size_name: 'larg',
            age_name: 'ten',
            profile_pic: 'https://csc648groupproject.s3-us-west-2.amazonaws.com/JujuPic.jpg' 
        },
        {   pet_id: 5,
            name: 'Max',
            size_name: 'small',
            age_name: 'two',
            profile_pic:'https://csc648groupproject.s3-us-west-2.amazonaws.com/MaxPic.jpg'
        },
        { pet_id: 6,
            name: 'Mimi',
            size_name: 'medium',
            age_name: 'six',
            profile_pic: 'https://csc648groupproject.s3-us-west-2.amazonaws.com/MimiPic.jpg' 
        }
    ],
    petProfiles: [
        { pet_id: 1,
            name: 'Mimi',
            size_name: 'medium',
            age_name: 'six',
            profile_pic: 'https://csc648groupproject.s3-us-west-2.amazonaws.com/MimiPic.jpg' 
        },
        {   pet_id: 3,
            name: 'Juju',
            size_name: 'larg',
            age_name: 'ten',
            profile_pic: 'https://csc648groupproject.s3-us-west-2.amazonaws.com/JujuPic.jpg' 
        },
        {   pet_id: 2,
            name: 'Max',
            size_name: 'small',
            age_name: 'two',
            profile_pic:'https://csc648groupproject.s3-us-west-2.amazonaws.com/MaxPic.jpg'
        },
        { pet_id: 4,
            name: 'Mimi',
            size_name: 'medium',
            age_name: 'six',
            profile_pic: 'https://csc648groupproject.s3-us-west-2.amazonaws.com/MimiPic.jpg' 
        },
        {   pet_id: 5,
            name: 'Juju',
            size_name: 'larg',
            age_name: 'ten',
            profile_pic: 'https://csc648groupproject.s3-us-west-2.amazonaws.com/JujuPic.jpg' 
        },
        {   pet_id: 6,
            name: 'Max',
            size_name: 'small',
            age_name: 'two',
            profile_pic:'https://csc648groupproject.s3-us-west-2.amazonaws.com/MaxPic.jpg'
        }
    ]
};

const newPetOwnerProfile = {
    accountType: 'pet owner',
    id: '11',
    userName: 'OldmanCatluvr',
    userPicture: '',
    about: 'Write down something to share with others!',
    photos: [],
    petProfiles: []
};


function Profile() {
    // switch profile type by changing the userProfile Ex: shelterProfile, businessProfile, newBusinessProfile and petOwnerProfile
    const [userProfile, setUserProfile] = useState(petOwnerProfile);
    const [selfView, setSelfView] = useState(true);

    useEffect(() => {

    }, [])

    function updateProfileHandler(type, value) {
        if (type === 'address' || type === 'phone' || type === 'hours') {
            console.log('value is ' + value + 'type is ' + type);
            setUserProfile(() => ({
                ...userProfile,
                contactInfo: {
                ...userProfile.contactInfo,
                [type]: value
                }
            }));
        }
        else {
            console.log('[value] is ' + value + ' and [type] is ' + type);
            setUserProfile(() => ({
                ...userProfile,
                [type]: value
            }));
        }
        console.log('updateProfileHandler');
    }

    function toggleSelfViewHandler() {
        setSelfView(!selfView);
        let button = document.getElementById('button');
        selfView ? button.className = styles.SwitchSelf : button.className = styles.SwitchVistor;
    }

    console.log(userProfile);
    return (
        <div className={styles.Profile} >
            <ProfileInfo isSelfView={selfView} profile={userProfile} updateProfile={updateProfileHandler} />
            <div className={styles.SwitchDiv} onClick={toggleSelfViewHandler} >
                <span 
                    className={styles.SwitchView} 
                    onClick={toggleSelfViewHandler}  >
                        {selfView ? 'switch to vistors view' : 'switch to self view' }
                </span>
                <div className={styles.Switch}>
                    <div className={styles.SwitchVistor} id='button' ></div>
                </div>
            </div>
            <div className={styles.Bottom}>
                <AboutMe isSelfView={selfView} profile={userProfile} updateProfile={updateProfileHandler} />
                <ProfileContent isSelfView={selfView} profile={userProfile} />
            </div>
        </div>
    )
}

export default Profile;