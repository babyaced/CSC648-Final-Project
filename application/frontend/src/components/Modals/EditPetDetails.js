import { useState, useEffect } from "react";

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

function EditPetDetails({
  display,
  updateProfile,
  profile,
  onClose,
  updatePetType,
  updatePetBreed,
  recievedPetAge,
  recievedPetSize,
  recievedPetType,
  recievedPetColors,
  recievedDogBreeds,
  recievedCatBreeds,
}) {
  console.log(recievedPetAge);
  console.log(recievedPetSize);
  console.log(recievedPetType);
  console.log(recievedPetColors);
  console.log(recievedDogBreeds);
  console.log(recievedCatBreeds);

  const [petName, setPetName] = useState(profile.display_name);
  const [petType, setPetType] = useState(recievedPetType); //set this to already existing pet type stored in db for real version
  const [dogBreed, setDogBreed] = useState(recievedDogBreeds);
  const [petColors, setPetColors] = useState(recievedPetColors);
  const [petSize, setPetSize] = useState(recievedPetSize);
  const [catBreed, setCatBreed] = useState(recievedCatBreeds);
  const [petAge, setPetAge] = useState(recievedPetAge);

  const [typeOptions] = useTypeOptions();

  const [dogBreedOptions] = useDogBreedOptions();

  const [catBreedOptions] = useCatBreedOptions();

  const [colorOptions] = useColorOptions();

  const [sizeOptions] = useSizeOptions();

  const [ageOptions] = useAgeOptions();

  useEffect(() => {
    setPetName(profile.display_name)
  }, [profile])

  //FIX THIS URGENTLY
  useEffect(() => {
    setPetType(recievedPetType)
    setDogBreed(recievedDogBreeds)
    setPetColors(recievedPetColors)
    setPetSize(recievedPetSize)
    setCatBreed(recievedCatBreeds);
    setPetAge(recievedPetAge);
  }, [recievedCatBreeds, recievedDogBreeds, recievedPetAge, recievedPetColors, recievedPetSize, recievedPetType])

  //function updatePet(){
  //     axios.post('/api/edit-pet',{})
  //     .then((response) =>{

  //     })
  //     .catch((err) =>{

  //     })
  // }

  console.log(petName)
  console.log(petType)
  console.log(dogBreed)
  console.log(petColors)
  console.log(petSize)
  console.log(catBreed)
  console.log(petAge)

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
            value={petName}
            placeholder="Name"
            onChange={(event) => updateProfile("userName", event.target.value)}
          />
        </div>
        <div className={styles["edit-pet-details-type"]}>
          <label for="type">Type</label>
          <Select
            id="type"
            name="pet_type"
            onChange={updatePetType}
            options={typeOptions}
            theme={SelectCustomTheme}
            value={petType}
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
            onChange={setPetColors}
            options={colorOptions}
            theme={SelectCustomTheme}
            placeholder="Select Pet Color(s)"
            isSearchable
            value={petColors}
            isMulti
          />
        </div>
        <div className={styles["edit-pet-details-age"]}>
          <label for="age">Age</label>
          <Select
            id="age"
            name="pet_age"
            onChange={setPetAge}
            options={ageOptions}
            theme={SelectCustomTheme}
            value={petAge}
            placeholder="Select Pet Age"
            isSearchable
          />
        </div>
        <div className={styles["edit-pet-details-size"]}>
          <label for="size">Size</label>
          <Select
            id="size"
            name="pet_size"
            onChange={setPetSize}
            options={sizeOptions}
            theme={SelectCustomTheme}
            placeholder="Select Pet Size"
            value={petSize}
            isSearchable
          />
        </div>
        {petType && petType.label === "Dog" && <div className={styles["edit-pet-details-breed"]}>
          <label for="breed">Breed</label>
          <Select
            id="breed"
            name="pet_breed"
            // onChange={updatePetBreed}
            onChange={setDogBreed}
            options={dogBreedOptions}
            theme={SelectCustomTheme}
            placeholder="Select Dog Breed"
            isSearchable
            isMulti
            value={dogBreed}
            components={animatedComponents}
          />
        </div>}
        {petType && petType.label === "Cat" && (
          <div className={styles["edit-pet-details-breed"]}>
            <label for="breed">Breed</label>
            <Select
              id="breed"
              name="pet_breed"
              // onChange={updatePetBreed}
              onChange={setCatBreed}
              options={catBreedOptions}
              theme={SelectCustomTheme}
              placeholder="Select Cat Breed"
              isSearchable
              isMulti
              value={catBreed}
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
