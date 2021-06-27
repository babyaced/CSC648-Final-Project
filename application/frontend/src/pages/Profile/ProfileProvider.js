import {
  INIT_PROFILE,
  PIC_EDIT,
  NAME_EDIT,
  ABOUT_ME_EDIT,
  INIT_PET_DETAILS,
  PET_DETAILS_EDIT,
  INIT_BIZ_DETAILS,
  PHONE_NUM_EDIT,
  HOURS_EDIT,
  ADDRESS_EDIT,
} from "./ProfileActions";

import {
  createContext,
  useCallback,
  useReducer,
  useEffect,
  useState,
} from "react";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import useTypeOptions from "../../components/DropdownOptions/useTypeOptions";
import useColorOptions from "../../components/DropdownOptions/useColorOptions";
import useAgeOptions from "../../components/DropdownOptions/useAgeOptions";
import useSizeOptions from "../../components/DropdownOptions/useSizeOptions";
import useDogBreedOptions from "../../components/DropdownOptions/useDogBreedOptions";
import useCatBreedOptions from "../../components/DropdownOptions/useCatBreedOptions";
import Spinner from "../../components/UI/Spinner/Spinner";

import reducer from "./ProfileReducer";

export const ProfileContext = createContext();

export const ProfileProvider = ({ appUser, children }) => {
  const [typeOptions] = useTypeOptions();
  const [colorOptions] = useColorOptions();
  const [ageOptions] = useAgeOptions();
  const [sizeOptions] = useSizeOptions();
  const [dogBreedOptions] = useDogBreedOptions();
  const [catBreedOptions] = useCatBreedOptions();

  const { profileID } = useParams();
  //console.log('profileID: ', profileID)

  const [loading, setLoading] = useState(true);

  //console.log('profile id from profile provider', profileID)
  const history = useHistory();

  //Get initial profile state from database here
  useEffect(() => {
    setLoading(true);
    if (
      typeOptions.length !== 0 &&
      colorOptions.length !== 0 &&
      ageOptions.length !== 0 &&
      sizeOptions.length !== 0 &&
      dogBreedOptions.length !== 0 &&
      catBreedOptions.length !== 0
    ) {
      const getProfile = axios.get("/api/profile", {
        params: { profileID: profileID },
      });
      const getPhotoPosts = axios.get("/api/photo-posts", {
        params: { profileID: profileID },
      });
      const getCurrentUserPets = axios.get("/api/pets", {
        params: { profileID: profileID },
      });
      const getTaggedPosts = axios.get("/api/tagged-posts", {
        params: { profileID: profileID },
      });
      const getIsFollowing = axios.get("/api/is-following", {
        params: { profileID: profileID },
      });
      let fetchedProfile;

      Promise.all([
        getProfile,
        getPhotoPosts,
        getCurrentUserPets,
        getTaggedPosts,
        getIsFollowing,
      ])
        .then((responses) => {
          if (!responses[0].data.profile) {
            history.push("/Feed");
          }

          fetchedProfile = {
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
            // Pet Specific Profile Info
            petType: {},
            petSize: {},
            petAge: {},
            petColors: [],
            dogBreeds: [],
            catBreeds: [],
            // Business Specific Profile Info
            address: "",
            hours: "",
            phoneNumber: "",
          };

          //console.log('fetchedProfile: ', fetchedProfile)
          dispatch({
            type: INIT_PROFILE,
            payload: { fetchedProfile },
          });
        })
        .then(() => {
          if (fetchedProfile.profileType === "Business") {
            const getHours = axios.get("/api/hours", {
              params: { profileID: profileID },
            });
            const getAddress = axios.get("/api/business-address", {
              params: { profileID: profileID },
            });
            const getPhoneNumber = axios.get("/api/business-phone-number", {
              params: { profileID: profileID },
            });

            Promise.all([getHours, getAddress, getPhoneNumber])
              .then((responses) => {
                dispatch({
                  type: INIT_BIZ_DETAILS,
                  payload: {
                    hours: responses[0].data,
                    address: responses[1].data.address,
                    phoneNumber: responses[2].data.phone_num,
                  },
                });
              })
              .then(() => setLoading(false))
              .catch((err) => {
                console.log(err);
              });
          } else if (fetchedProfile.petId) {
            //console.log('fetchedProfile.petId: ', fetchedProfile.petId)
            axios
              .get("/api/pet-details", {
                params: {
                  petID: fetchedProfile.petId,
                  typeOptions: typeOptions,
                  colorOptions: colorOptions,
                  ageOptions: ageOptions,
                  sizeOptions: sizeOptions,
                  dogBreedOptions: dogBreedOptions,
                  catBreedOptions: catBreedOptions,
                },
              })
              .then((res) => {
                //console.log('res.data: ', res.data)
                dispatch({
                  type: INIT_PET_DETAILS,
                  payload: {
                    petType: res.data.petType,
                    petAge: res.data.petAge,
                    petSize: res.data.petSize,
                    petColors: res.data.petColors,
                    dogBreeds: res.data.dogBreeds,
                    catBreeds: res.data.catBreeds,
                  },
                });
              })
              .then(() => setLoading(false))
              .catch((err) => {
                console.log(err);
              });
          } else {
            setLoading(false);
          }
        })
        .catch((err) => {
          setLoading(false);
          //display error message to user
        });
    }
  }, [
    profileID,
    typeOptions,
    ageOptions,
    colorOptions,
    sizeOptions,
    catBreedOptions,
    dogBreedOptions,
  ]);

  const [profile, dispatch] = useReducer(reducer, null);

  //console.log('profile: ', profile)

  const editPetType = useCallback(
    (newPetType) => {
      dispatch({
        type: PET_DETAILS_EDIT,
        payload: { newPetType },
      });
    },
    [dispatch]
  );

  const editName = useCallback(
    (newName) => {
      //console.log('newName', newName)
      dispatch({
        type: NAME_EDIT,
        payload: { newName },
      });
    },
    [dispatch]
  );

  const editProfilePic = useCallback(
    (newURL) => {
      //console.log('newURL', newURL)
      dispatch({
        type: PIC_EDIT,
        payload: { newURL },
      });
    },
    [dispatch]
  );

  const editHours = useCallback(
    (newHours) => {
      console.log("newHours", newHours);
      dispatch({
        type: HOURS_EDIT,
        payload: { newHours },
      });
    },
    [dispatch]
  );

  const editAddress = useCallback(
    (newAddress) => {
      console.log("newAddress", newAddress);
      dispatch({
        type: ADDRESS_EDIT,
        payload: { newAddress },
      });
    },
    [dispatch]
  );

  const editPhoneNumber = useCallback(
    (newPhoneNumber) => {
      console.log("newPhoneNumber", newPhoneNumber);
      dispatch({
        type: PHONE_NUM_EDIT,
        payload: { newPhoneNumber },
      });
    },
    [dispatch]
  );

  const editAboutMe = useCallback(
    (newAboutMe) => {
      //console.log('newHours', newAboutMe)
      dispatch({
        type: ABOUT_ME_EDIT,
        payload: { newAboutMe },
      });
    },
    [dispatch]
  );

  const editPetDetails = useCallback(
    (newPetDetails) => {
      console.log("newPetDetails", newPetDetails);
      dispatch({
        type: PET_DETAILS_EDIT,
        payload: {
          newPetType: newPetDetails.newType,
          newPetAge: newPetDetails.newAge,
          newPetSize: newPetDetails.newSize,
          newPetColors: newPetDetails.newColors,
          newDogBreeds: newPetDetails.newCatBreeds,
          newCatBreeds: newPetDetails.newCatBreeds,
        },
      });
    },
    [dispatch]
  );

  const provisions = {
    profileID,
    appUser,
    profile,
    loading,
    typeOptions,
    sizeOptions,
    ageOptions,
    colorOptions,
    dogBreedOptions,
    catBreedOptions,
    editPetType,
    editName,
    editProfilePic,
    editAboutMe,
    editPetDetails,
    editHours,
    editAddress,
    editPhoneNumber,
  };

  return (
    <>
      {loading && <Spinner />}
      {!loading && (
        <>
          <ProfileContext.Provider value={provisions}>
            {children}
          </ProfileContext.Provider>
        </>
      )}
    </>
  );
};
