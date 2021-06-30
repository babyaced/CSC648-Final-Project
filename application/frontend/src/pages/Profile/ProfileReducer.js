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
const reducer = (state, action) => {
  ////console.log('state: ', state, 'action: ', action)

  if (action.type === INIT_PROFILE) {
    return Object.assign({}, state, action.payload.fetchedProfile);
  }

  if (action.type === PIC_EDIT) {
    return Object.assign({}, state, { profilePic: action.payload.newURL });
  }

  if (action.type === NAME_EDIT) {
    ////console.log('action', action)
    return Object.assign({}, state, { displayName: action.payload.newName });
  }

  if (action.type === ABOUT_ME_EDIT) {
    ////console.log('action', action)
    return Object.assign({}, state, { aboutMe: action.payload.newAboutMe });
  }

  if (action.type === INIT_PET_DETAILS) {
    //console.log("action.payload.petColors", action.payload.petColors);
    //console.log("action.payload.catBreeds", action.payload.catBreeds);
    //console.log("action.payload.dogBreeds", action.payload.dogBreeds);
    let colorsArray = [];
    let i;
    for (i = 0; i < action.payload.petColors.length; i++) {
      colorsArray.push(JSON.parse(action.payload.petColors[i]));
    }
    let catBreedsArray = [];
    for (i = 0; i < action.payload.catBreeds.length; i++) {
      catBreedsArray.push(JSON.parse(action.payload.catBreeds[i]));
    }
    ////console.log('action', action)
    let dogBreedsArray = [];
    for (i = 0; i < action.payload.dogBreeds.length; i++) {
      dogBreedsArray.push(JSON.parse(action.payload.dogBreeds[i]));
    }

    return Object.assign({}, state, {
      petType: JSON.parse(action.payload.petType),
      petAge: JSON.parse(action.payload.petAge),
      petSize: JSON.parse(action.payload.petSize),
      petColors: colorsArray,
      dogBreeds: dogBreedsArray,
      catBreeds: catBreedsArray,
    });
  }

  if (action.type === PET_DETAILS_EDIT) {
    return Object.assign({}, state, {
      displayName: action.payload.displayName,
      petType: action.payload.newPetType,
      petAge: action.payload.newPetAge,
      petSize: action.payload.newPetSize,
      petColors: action.payload.newPetColors,
      dogBreeds: action.payload.newDogBreeds,
      catBreeds: action.payload.newCatBreeds,
    });
  }

  if (action.type === INIT_BIZ_DETAILS) {
    return Object.assign({}, state, {
      hours: action.payload.hours,
      address: action.payload.address,
      phoneNumber: action.payload.phoneNumber,
    });
  }

  if (action.type === PHONE_NUM_EDIT) {
    return Object.assign({}, state, {
      phoneNumber: action.payload.newPhoneNumber,
    });
  }

  if (action.type === HOURS_EDIT) {
    return Object.assign({}, state, {
      hours: action.payload.newHours,
    });
  }

  if (action.type === ADDRESS_EDIT) {
    return Object.assign({}, state, {
      address: action.payload.newAddress,
    });
  }
};

export default reducer;
