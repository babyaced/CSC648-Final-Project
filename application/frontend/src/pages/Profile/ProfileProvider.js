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

const INITIALIZE_PROFILE = 'INITIALIZE_PROFILE'
const INITIALIZE_PET_DETAILS = 'INITIALIZE_PET_DETAILS'

//SELF VIEW

const ABOUT_ME_EDIT = 'ABOUT_ME_EDIT'

//Pet Owner Profile
const NAME_EDIT = 'NAME_EDIT'

//Pet Profile
const PET_DETAILS_EDIT = 'PET_TYPE_EDIT'
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

    if (action.type === INITIALIZE_PROFILE) {
        return Object.assign({}, state, action.payload.fetchedProfile)
    }

    if (action.type === INITIALIZE_PET_DETAILS) {
        console.log('action', action)
        return Object.assign({}, state, {
            petType: action.payload.petType,
            petAge: action.payload.petAge,
            petSize: action.payload.petSize,
            petColors: action.payload.petColors,
            dogBreeds: action.payload.dogBreeds,
            catBreeds: action.payload.catBreeds
        })
    }

    if (action.type === PET_DETAILS_EDIT) {
        return Object.assign({}, state, {
            petType: action.payload.newPetType,
            petAge: action.payload.newPetAge,
            petSize: action.payload.newPetSize,
            petColors: action.payload.newPetColors,
            dogBreeds: action.payload.newDogBreeds,
            catBreeds: action.payload.newCatBreeds
        })
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
    const [typeOptions] = useTypeOptions();
    const [colorOptions] = useColorOptions();
    const [ageOptions] = useAgeOptions();
    const [sizeOptions] = useSizeOptions();
    const [dogBreedOptions] = useDogBreedOptions();
    const [catBreedOptions] = useCatBreedOptions();

    const { profileID } = useParams();
    console.log('profileID: ', profileID)

    const [loading, setLoading] = useState(true);

    console.log('profile id from profile provider', profileID)
    const history = useHistory();


    //Get initial profile state from database here
    useEffect(() => {
        setLoading(true)
        if (typeOptions.length !== 0 && colorOptions.length !== 0 && ageOptions.length !== 0 && sizeOptions.length !== 0 && dogBreedOptions.length !== 0 && catBreedOptions.length !== 0) {
            const getProfile = axios.get("/api/profile", { params: { profileID: profileID } });
            const getPhotoPosts = axios.get("/api/photo-posts", { params: { profileID: profileID } });
            const getCurrentUserPets = axios.get("/api/pets", { params: { profileID: profileID } });
            const getTaggedPosts = axios.get("/api/tagged-posts", { params: { profileID: profileID } });
            const getIsFollowing = axios.get("/api/is-following", { params: { profileID: profileID } });
            let fetchedProfile

            Promise.all([getProfile, getPhotoPosts, getCurrentUserPets, getTaggedPosts, getIsFollowing])
                .then((responses) => {
                    if (!responses[0].data.profile) {
                        //if the profile doesn't exist, redirect user
                        history.push("/Feed");
                    }

                    console.log('responses[0].data.profile: ', responses[0].data.profile)

                    fetchedProfile =
                    {
                        displayName: responses[0].data.profile.display_name,
                        aboutMe: responses[0].data.profile.about_me,
                        profilePic: responses[0].data.profile.profile_pic_link,
                        profileType: responses[0].data.profile.type,
                        profileId: responses[0].data.profile.profile_id,
                        accountId: responses[0].data.profile.account_id,
                        petId: responses[0].data.profile.pet_id,
                        selfView: responses[0].data.selfView,
                        adminView: responses[0].data.adminView,
                        fetchedPhotoPosts: responses[1].data,
                        fetchedPets: responses[2].data,
                        taggedPosts: responses[3].data,
                        followingStatus: responses[4].data,
                        petType: {},
                        petSize: {},
                        petAge: {},
                        petColors: [],
                        dogBreed: [],
                        catBreed: []
                    }

                    console.log('fetchedProfile: ', fetchedProfile)
                    dispatch({
                        type: INITIALIZE_PROFILE,
                        payload: { fetchedProfile }
                    })
                })
                .then(() => {
                    if (fetchedProfile.petId) {
                        console.log('fetchedProfile.petId: ', fetchedProfile.petId)
                        axios.get("/api/pet-details", {
                            params: {
                                petID: fetchedProfile.petId,
                                typeOptions: typeOptions,
                                colorOptions: colorOptions,
                                ageOptions: ageOptions,
                                sizeOptions: sizeOptions,
                                dogBreedOptions: dogBreedOptions,
                                catBreedOptions: catBreedOptions,
                            }
                        })
                            .then((res) => {
                                console.log('res.data: ', res.data)
                                dispatch({
                                    type: INITIALIZE_PET_DETAILS,
                                    payload: {
                                        petType: res.data.petType,
                                        petAge: res.data.petAge,
                                        petSize: res.data.petSize,
                                        petColors: res.data.petColors,
                                        dogBreeds: res.data.dogBreeds,
                                        catBreeds: res.data.catBreeds
                                    }
                                })

                            })
                            .then(() => setLoading(false))
                            .catch((err) => {
                                console.log(err)
                            })
                    }
                    else {
                        setLoading(false);
                    }
                })
                .catch((err) => {
                    setLoading(false);
                    //display error message to user
                })
        }
    }, [profileID, typeOptions, ageOptions, colorOptions, sizeOptions, catBreedOptions, dogBreedOptions])

    const [profile, dispatch] = useReducer(reducer, null);

    console.log('profile: ', profile)

    const editPetType = useCallback(newPetType => {
        dispatch({
            type: PET_DETAILS_EDIT,
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

    const editPetDetails = useCallback(() => {
        console.log('newPetDetails')
        dispatch({
            type: PET_DETAILS_EDIT,
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

    const provisions = { profile, loading, profileID, editPetType, editName, updateProfileHandler, appUser, editProfilePic, editAboutMe, typeOptions, sizeOptions, ageOptions, colorOptions, dogBreedOptions, catBreedOptions, editPetDetails }

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