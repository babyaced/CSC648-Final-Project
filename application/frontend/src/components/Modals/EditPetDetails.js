import { useState, useEffect, useContext } from "react";

import Modal from "./Modal";

import Select from "react-select";

import makeAnimated from "react-select/animated";

import styles from "./EditPetDetails.module.css";
import axios from "axios";

import SelectCustomTheme from "../../mods/SelectCustomTheme";

import { ProfileContext } from "../../pages/Profile/ProfileProvider";

import ButtonLoader from "../UI/Spinner/ButtonLoader";

function EditPetDetails({ display, onClose }) {
  //console.log("editPetDetailsDisplay: ", display);

  const {
    profile,
    typeOptions,
    colorOptions,
    ageOptions,
    sizeOptions,
    dogBreedOptions,
    catBreedOptions,
    editPetDetails,
    profileID,
  } = useContext(ProfileContext);

  //Holds the values that will be edited in the profile context when the form is submitted
  const [localPetName, setLocalPetName] = useState(profile.displayName);
  const [localPetType, setLocalPetType] = useState(profile.petType);
  const [localPetAge, setLocalPetAge] = useState(profile.petAge);
  const [localPetSize, setLocalPetSize] = useState(profile.petSize);
  const [localPetColors, setLocalPetColors] = useState(profile.petColors);
  const [localDogBreeds, setLocalDogBreeds] = useState(profile.dogBreeds);
  const [localCatBreeds, setLocalCatBreeds] = useState(profile.catBreeds);

  const [awaitingResponse, setAwaitingResponse] = useState(false);

  const animatedComponents = makeAnimated();

  function updatePetDetails(event) {
    event.preventDefault();
    setAwaitingResponse(true);
    //console.log("updating pet details");
    axios
      .put("/api/pet", {
        newName: localPetName,
        newPetType: localPetType,
        newAge: localPetAge,
        newSize: localPetSize,
        newColors: localPetColors,
        newDogBreeds: localDogBreeds,
        newCatBreeds: localCatBreeds,
        petProfileID: profileID,
      })
      .then(() => {
        editPetDetails({
          petProfileID: profileID,
          newName: localPetName,
          newType: localPetType,
          newAge: localPetAge,
          newSize: localPetSize,
          newColors: localPetColors,
          newDogBreeds: localDogBreeds,
          newCatBreeds: localCatBreeds,
        });
        setAwaitingResponse(false);
        onClose();
      })
      .catch((err) => {
        setAwaitingResponse(false);
      });
  }

  return (
    <Modal display={display} onClose={onClose}>
      <div className={styles["edit-pet-details-header"]}>
        Edit Pet Information
      </div>
      <form
        className={styles["edit-pet-details-container"]}
        onSubmit={updatePetDetails}
      >
        <div className={styles["edit-pet-details-name"]}>
          <label for="name">Name</label>
          <input
            type="text"
            id="name"
            name="pet_name"
            maxLength="25"
            value={localPetName}
            placeholder="Name"
            onChange={(event) => setLocalPetName(event.target.value)}
            disabled={awaitingResponse}
          />
        </div>
        <div className={styles["edit-pet-details-type"]}>
          <label for="type">Type</label>
          <Select
            id="type"
            name="pet_type"
            onChange={setLocalPetType}
            options={typeOptions}
            theme={SelectCustomTheme}
            value={localPetType}
            placeholder="Select Pet Type"
            isSearchable
            disabled={awaitingResponse}
          />
        </div>
        {/* <div className={styles["edit-pet-details-breed"]}>
          <label for="breed">Breed</label>
          <Select
            id="breed"
            name="pet_breed"
            onChange={updatePetBreed}
            options={dogBreedOptions}
            theme={SelectCustomTheme}
            placeholder="Select Dog Breed"
            isSearchable
            isMulti
            // value = {petBreed}
            components={animatedComponents}
          />
        </div> */}
        <div className={styles["edit-pet-details-color"]}>
          <label for="color">Color(s)</label>
          <Select
            id="color"
            name="pet_color"
            onChange={setLocalPetColors}
            options={colorOptions}
            theme={SelectCustomTheme}
            placeholder="Select Pet Color(s)"
            isSearchable
            value={localPetColors}
            isMulti
            disabled={awaitingResponse}
          />
        </div>
        <div className={styles["edit-pet-details-age"]}>
          <label for="age">Age</label>
          <Select
            id="age"
            name="pet_age"
            onChange={setLocalPetAge}
            options={ageOptions}
            theme={SelectCustomTheme}
            value={localPetAge}
            placeholder="Select Pet Age"
            isSearchable
            disabled={awaitingResponse}
          />
        </div>
        <div className={styles["edit-pet-details-size"]}>
          <label for="size">Size</label>
          <Select
            id="size"
            name="pet_size"
            onChange={setLocalPetSize}
            options={sizeOptions}
            theme={SelectCustomTheme}
            placeholder="Select Pet Size"
            value={localPetSize}
            isSearchable
            disabled={awaitingResponse}
          />
        </div>
        {localPetType && localPetType.label === "Dog" && (
          <div className={styles["edit-pet-details-breed"]}>
            <label for="breed">Breed</label>
            <Select
              id="breed"
              name="pet_breed"
              onChange={setLocalDogBreeds}
              options={dogBreedOptions}
              theme={SelectCustomTheme}
              placeholder="Select Dog Breed"
              isSearchable
              isMulti
              value={localDogBreeds}
              components={animatedComponents}
              disabled={awaitingResponse}
            />
          </div>
        )}
        {localPetType && localPetType.label === "Cat" && (
          <div className={styles["edit-pet-details-breed"]}>
            <label for="breed">Breed</label>
            <Select
              id="breed"
              name="pet_breed"
              onChange={setLocalCatBreeds}
              options={catBreedOptions}
              theme={SelectCustomTheme}
              placeholder="Select Cat Breed"
              isSearchable
              isMulti
              value={localCatBreeds}
              components={animatedComponents}
              disabled={awaitingResponse}
            />
          </div>
        )}
        <button
          className={styles["edit-pet-details-submit"]}
          type="submit"
          disabled={awaitingResponse}
        >
          {awaitingResponse ? <ButtonLoader message={"Submit"} /> : "Submit"}
        </button>
      </form>
    </Modal>
  );
}

export default EditPetDetails;
