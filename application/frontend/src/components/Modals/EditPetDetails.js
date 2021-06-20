import { useState, useEffect, useContext } from "react";

import Modal from "./Modal";

import Select from "react-select";

import makeAnimated from "react-select/animated";

import styles from "./EditPetDetails.module.css";
import axios from "axios";

import SelectCustomTheme from "../../mods/SelectCustomTheme";

import useTypeOptions from "../DropdownOptions/useTypeOptions";
import useColorOptions from "../DropdownOptions/useColorOptions";
import useAgeOptions from "../DropdownOptions/useAgeOptions";
import useSizeOptions from "../DropdownOptions/useSizeOptions";
import useCatBreedOptions from "../DropdownOptions/useCatBreedOptions";
import useDogBreedOptions from "../DropdownOptions/useDogBreedOptions";
import { ProfileContext } from "../../pages/Profile/ProfileProvider";

function EditPetDetails({ display, onClose }) {
  console.log('editPetDetailsDisplay: ', display)

  const { profile, typeOptions, colorOptions, ageOptions, sizeOptions, dogBreedOptions, catBreedOptions, editName } = useContext(ProfileContext)


  //function updatePet(){
  //     axios.post('/api/edit-pet',{})
  //     .then((response) =>{

  //     })
  //     .catch((err) =>{

  //     })
  // }

  const animatedComponents = makeAnimated();

  return (
    <Modal display={display} onClose={onClose}>
      <div className={styles["edit-pet-details-header"]}>
        Edit Pet Information
      </div>
      <div className={styles["edit-pet-details-container"]}>
        <div className={styles["edit-pet-details-name"]}>
          <label for="name">Name</label>
          <input
            type="text"
            id="name"
            name="pet_name"
            maxLength="25"
            value={profile.displayName}
            placeholder="Name"
            onChange={(event) => editName(event.target.value)}
          />
        </div>
        <div className={styles["edit-pet-details-type"]}>
          <label for="type">Type</label>
          <Select
            id="type"
            name="pet_type"
            // onChange={updatePetType}
            options={typeOptions}
            theme={SelectCustomTheme}
            value={profile.petType}
            placeholder="Select Pet Type"
            isSearchable
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
            // onChange={setPetColors}
            options={colorOptions}
            theme={SelectCustomTheme}
            placeholder="Select Pet Color(s)"
            isSearchable
            value={profile.petColors}
            isMulti
          />
        </div>
        <div className={styles["edit-pet-details-age"]}>
          <label for="age">Age</label>
          <Select
            id="age"
            name="pet_age"
            // onChange={setPetAge}
            options={ageOptions}
            theme={SelectCustomTheme}
            value={profile.petAge}
            placeholder="Select Pet Age"
            isSearchable
          />
        </div>
        <div className={styles["edit-pet-details-size"]}>
          <label for="size">Size</label>
          <Select
            id="size"
            name="pet_size"
            // onChange={setPetSize}
            options={sizeOptions}
            theme={SelectCustomTheme}
            placeholder="Select Pet Size"
            value={profile.petSize}
            isSearchable
          />
        </div>
        {profile.petType && profile.petType.label === "Dog" && <div className={styles["edit-pet-details-breed"]}>
          <label for="breed">Breed</label>
          <Select
            id="breed"
            name="pet_breed"
            // onChange={updatePetBreed}
            // onChange={setDogBreed}
            options={dogBreedOptions}
            theme={SelectCustomTheme}
            placeholder="Select Dog Breed"
            isSearchable
            isMulti
            value={profile.dogBreed}
            components={animatedComponents}
          />
        </div>}
        {profile.petType && profile.petType.label === "Cat" && (
          <div className={styles["edit-pet-details-breed"]}>
            <label for="breed">Breed</label>
            <Select
              id="breed"
              name="pet_breed"
              // onChange={updatePetBreed}
              // onChange={setCatBreed}
              options={catBreedOptions}
              theme={SelectCustomTheme}
              placeholder="Select Cat Breed"
              isSearchable
              isMulti
              value={profile.catBreed}
              components={animatedComponents}
            />
          </div>
        )}
        <button className={styles["edit-pet-details-submit"]} onClick={onClose}>
          Submit
        </button>
      </div>
    </Modal>
  );
}

export default EditPetDetails;
