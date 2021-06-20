import { createContext, useCallback, useReducer, useEffect, useRef, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios'
import useTypeOptions from '../../components/DropdownOptions/useTypeOptions';
import useColorOptions from '../../components/DropdownOptions/useColorOptions';
import useAgeOptions from '../../components/DropdownOptions/useAgeOptions';
import useSizeOptions from '../../components/DropdownOptions/useSizeOptions';
import useDogBreedOptions from '../../components/DropdownOptions/useDogBreedOptions';
import useCatBreedOptions from '../../components/DropdownOptions/useCatBreedOptions';
import Spinner from '../../components/UI/Spinner/Spinner';

export const ProfileContext = createContext();

const INITIALIZE = 'INITIALIZE'

//SELF VIEW

const ABOUT_ME_EDIT = 'ABOUT_ME_EDIT'

//Pet Owner Profile
const NAME_EDIT = 'NAME_EDIT'

//Pet Profile
const PET_TYPE_EDIT = 'PET_TYPE_EDIT'
const PET_BREED_EDIT = 'PET_BREED_EDIT'

const PROFILE_PIC_EDIT = 'PROFILE_PIC_EDIT'

//Business Profile
const HOURS_EDIT = 'HOURS_EDIT'
const ADDRESS_EDIT = 'ADDRESS_EDIT'

//Shelter Profile
const SHELTERED_PET_TYPES_EDIT = 'SHELTERED_PET_TYPES_EDIT'

//VISITOR VIEW
const FOLLOW_USER = 'FOLLOW_USER'
//Pet Owner Profile

//Pet Profile

//Business Profile

//Shelter Profile


const reducer = (state, action) => {
    console.log('state: ', state, 'action: ', action)

    if (action.type === INITIALIZE) {
        return Object.assign({}, state, action.payload.fetchedProfile)
    }

    if (action.type === PET_TYPE_EDIT) {

    }

    if (action.type === PROFILE_PIC_EDIT) {
        return Object.assign({}, state, { profilePic: action.payload.newURL })
    }

    if (action.type === NAME_EDIT) {
        console.log('action', action)
        return Object.assign({}, state, { displayName: action.payload.newName })
    }

    if (action.type === ABOUT_ME_EDIT) {
        console.log('action', action)
        return Object.assign({}, state, { aboutMe: action.payload.newAboutMe })
    }
}

export const ProfileProvider = ({ appUser, children }) => {
    // const [typeOptions] = useTypeOptions();
    // const [colorOptions] = useColorOptions();
    // const [ageOptions] = useAgeOptions();
    // const [sizeOptions] = useSizeOptions();
    // const [dogBreedOptions] = useDogBreedOptions();
    // const [catBreedOptions] = useCatBreedOptions();

    const { profileID } = useParams();
    console.log('profileID: ', profileID)

    const [loading, setLoading] = useState(true);

    console.log('profile id from profile provider', profileID)
    const history = useHistory();


    //Get initial profile state from database here
    useEffect(() => {
        setLoading(true)
        const getProfile = axios.get("/api/profile", { params: { profileID: profileID } });
        const getPhotoPosts = axios.get("/api/photo-posts", { params: { profileID: profileID } });
        const getCurrentUserPets = axios.get("/api/pets", { params: { profileID: profileID } });
        const getTaggedPosts = axios.get("/api/tagged-posts", { params: { profileID: profileID } });
        const getIsFollowing = axios.get("/api/is-following", { params: { profileID: profileID } });

        Promise.all([
            getProfile,
            getPhotoPosts,
            getCurrentUserPets,
            getTaggedPosts,
            getIsFollowing,
        ])
            .then((responses) => {
                if (!responses[0].data.profile) {
                    //if the profile doesn't exist, redirect user
                    history.push("/Feed");
                }

                console.log('responses[0].data.profile: ', responses[0].data.profile)

                let fetchedProfile =
                {
                    displayName: responses[0].data.profile.display_name,
                    aboutMe: responses[0].data.profile.about_me,
                    profilePic: responses[0].data.profile.profile_pic_link,
                    profileType: responses[0].data.profile.type,
                    profileId: responses[0].data.profile.profile_id,
                    accountId: responses[0].data.profile.account_id,
                    selfView: responses[0].data.selfView,
                    adminView: responses[0].data.adminView,
                    fetchedPhotoPosts: responses[1].data,
                    fetchedPets: responses[2].data,
                    taggedPosts: responses[3].data,
                    followingStatus: responses[4].data
                }

                dispatch({
                    type: INITIALIZE,
                    payload: { fetchedProfile }
                })

                setLoading(false);
            })
            .catch((err) => {
                // setLoading(false);
                //display error message to user
            });
    }, [profileID])

    const [profile, dispatch] = useReducer(reducer, null);

    console.log('profile: ', profile)

    const editPetType = useCallback(newPetType => {
        dispatch({
            type: PET_TYPE_EDIT,
            payload: { newPetType }
        })
    }, [dispatch])

    const editName = useCallback(newName => {
        console.log('newName', newName)
        dispatch({
            type: NAME_EDIT,
            payload: { newName }
        })
    }, [dispatch])

    const editProfilePic = useCallback(newURL => {
        console.log('newURL', newURL)
        dispatch({
            type: NAME_EDIT,
            payload: { newURL }
        })
    }, [dispatch])

    const editHours = useCallback(newHours => {
        console.log('newHours', newHours)
        dispatch({
            type: HOURS_EDIT,
            payload: { newHours }
        })
    }, [dispatch])

    const editAboutMe = useCallback(newAboutMe => {
        console.log('newHours', newAboutMe)
        dispatch({
            type: ABOUT_ME_EDIT,
            payload: { newAboutMe }
        })
    }, [dispatch])

    const [userProfile, setUserProfile] = useState();

    function updateProfileHandler(type, value) {
        if (type === "address" || type === "phone" || type === "hours") {
            setUserProfile(() => ({
                ...userProfile,
                contactInfo: {
                    ...userProfile.contactInfo,
                    [type]: value,
                },
            }));
        } else {
            setUserProfile(() => ({
                ...userProfile,
                [type]: value,
            }));
        }
    }

    const provisions = { profile, loading, profileID, editPetType, editName, updateProfileHandler, appUser, editProfilePic, editAboutMe }

    return (<>
        {loading && <Spinner />}
        {
            !loading &&
            <>
                <ProfileContext.Provider value={provisions}>
                    {children}
                </ProfileContext.Provider>
            </>
        }
    </>

    )
}