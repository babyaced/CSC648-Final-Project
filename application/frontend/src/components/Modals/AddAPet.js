import { useEffect, useState } from "react";

import Modal from "./Modal";

import styles from "./EditPetDetails.module.css";

import Select from "react-select";

import makeAnimated from "react-select/animated";
import axios from "axios";

//component
import ButtonLoader from "../UI/Spinner/ButtonLoader";

import SelectCustomTheme from "../../mods/SelectCustomTheme";
import ServerErrorMessage from "../InfoMessages/ServerErrorMessage";

function AddAPet({
  display,
  onClose,
  typeOptions,
  dogBreedOptions,
  catBreedOptions,
  colorOptions,
  sizeOptions,
  ageOptions,
  updatePetsState,
}) {
  //States to be set and sent to db
  const [petName, setPetName] = useState("");
  const [petColor, setPetColor] = useState([]);
  const [petSize, setPetSize] = useState();
  const [petAge, setPetAge] = useState();
  const [petType, setPetType] = useState();
  const [dogBreed, setDogBreed] = useState([]);
  const [catBreed, setCatBreed] = useState([]);
  //Loading UI
  const [loading, setLoading] = useState(false);

  const [serverError, setServerError] = useState(false);

  function createPetProfile(event) {
    event.preventDefault();
    setServerError(false);
    setLoading(true);

    axios
      .post("/api/pet", {
        name: petName,
        petType: petType,
        age: petAge,
        color: petColor,
        dogBreed: dogBreed,
        catBreed: catBreed,
        size: petSize,
      })
      .then((res) => {
        //console.log("res.data: ", res.data);
        setLoading(false);
        onClose();
        updatePetsState(res.data);
      })
      .catch((err) => {
        if (err.response.status === 500) {
          setServerError(true);
          setLoading(false);
        }

        // update()
        //display error to user
      });
    // remove later when the setLoading is working in the then block
    // setLoading(false);
  }

  const animatedComponents = makeAnimated();

  return (
    <Modal display={display} onClose={onClose}>
      <form onSubmit={createPetProfile}>
        <div className={styles["edit-pet-details-header"]}>
          <h1>Add a Pet</h1>
        </div>
        <div className={styles["edit-pet-details-container"]}>
          <div className={styles["edit-pet-details-name"]}>
            <label for="name">Name</label>
            <input
              type="text"
              id="name"
              name="pet_name"
              maxLength="25"
              required
              value={petName}
              // value={props.profile.userName}
              // onChange={event => props.updateProfile('userName', event.target.value)}
              onChange={(event) => setPetName(event.target.value)}
              placeholder="Name"
              disabled={loading}
            />
          </div>
          <div className={styles["edit-pet-details-type"]}>
            <label for="type">Type</label>
            <Select
              id="type"
              name="pet_type"
              // onChange={props.updatePetType}
              onChange={setPetType}
              options={typeOptions}
              theme={SelectCustomTheme}
              value={petType}
              required
              placeholder="Select Pet Type"
              isSearchable
              disabled={loading}
            />
          </div>

          <div className={styles["edit-pet-details-color"]}>
            <label for="color">Color(s)</label>
            <Select
              id="color"
              name="pet_color"
              onChange={setPetColor}
              options={colorOptions}
              theme={SelectCustomTheme}
              value={petColor}
              required
              placeholder="Select Pet Color(s)"
              isSearchable
              isMulti
              disabled={loading}
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
              required
              placeholder="Select Pet Age"
              isSearchable
              disabled={loading}
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
              value={petSize}
              required
              placeholder="Select Pet Size"
              isSearchable
              disabled={loading}
            />
          </div>
          {petType && petType.label === "Dog" && (
            <div className={styles["edit-pet-details-breed"]}>
              <label for="breed">Breed</label>
              <Select
                id="breed"
                name="pet_breed"
                // onChange={props.updatePetBreed}
                onChange={setDogBreed}
                options={dogBreedOptions}
                theme={SelectCustomTheme}
                placeholder="Select Dog Breed"
                isSearchable
                required
                isMulti
                components={animatedComponents}
                disabled={loading}
              />
            </div>
          )}
          {petType && petType.label === "Cat" && (
            <div className={styles["edit-pet-details-breed"]}>
              <label for="breed">Breed</label>
              <Select
                id="breed"
                name="pet_breed"
                // onChange={props.updatePetBreed}
                onChange={setCatBreed}
                options={catBreedOptions}
                theme={SelectCustomTheme}
                placeholder="Select Cat Breed"
                isSearchable
                required
                isMulti
                components={animatedComponents}
                disabled={loading}
              />
            </div>
          )}
          <button
            className={styles["edit-pet-details-submit"]}
            type="submit"
            disabled={loading}
          >
            {loading ? <ButtonLoader /> : "Submit"}
          </button>
        </div>
      </form>
      <ServerErrorMessage serverError={serverError} />
    </Modal>
  );
}

export default AddAPet;
