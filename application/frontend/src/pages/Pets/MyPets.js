import { useState, useEffect, useContext } from "react";
import { Link, useHistory } from "react-router-dom";

import styles from "./MyPets.module.css";
import axios from "axios";

import ConfirmDeletion from "../../components/Modals/ConfirmDeletion";

//Import UI Components
import MyPetCard from "../../components/Cards/PetCard/MyPetCard";
import AddAPet from "../../components/Modals/AddAPet";
import Spinner from "../../components/UI/Spinner/Spinner";

import { RedirectPathContext } from "../../context/redirect-path";
import AddPetCard from "../../components/Cards/PetCard/AddPetCard";
import useTypeOptions from "../../components/DropdownOptions/useTypeOptions";
import useDogBreedOptions from "../../components/DropdownOptions/useDogBreedOptions";
import useCatBreedOptions from "../../components/DropdownOptions/useCatBreedOptions";
import useColorOptions from "../../components/DropdownOptions/useColorOptions";
import useAgeOptions from "../../components/DropdownOptions/useAgeOptions";
import useSizeOptions from "../../components/DropdownOptions/useSizeOptions";

function MyPets() {
  const [deletionModalDisplay, setDeletionModalDisplay] = useState(false);
  const [additionModalDisplay, setAdditionModalDisplay] = useState(false);

  const [selectedPet, setSelectedPet] = useState({});

  const [myPets, setMyPets] = useState([]);

  const [typeOptions] = useTypeOptions();
  const [dogBreedOptions] = useDogBreedOptions();
  const [catBreedOptions] = useCatBreedOptions();
  const [colorOptions] = useColorOptions();
  const [sizeOptions] = useSizeOptions();
  const [ageOptions] = useAgeOptions();

  const [loading, setLoading] = useState(false);

  //const redirectContext = useContext(RedirectPathContext);
  const history = useHistory();

  function viewDeletionModal(pet) {
    setSelectedPet(pet);
    setDeletionModalDisplay(true);
  }

  function viewAdditionModal() {
    setAdditionModalDisplay(true);
  }

  useEffect(() => {
    setLoading(true);

    const getCurrentUserPets = axios.get("/api/current-user-pets");

    Promise.all([getCurrentUserPets])
      .then((responses) => {
        setMyPets(responses[0].data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function deletePet() {
    axios
      .post("/api/delete-pet", { petProfileID: selectedPet.profile_id })
      .then((res) => {
        setDeletionModalDisplay(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <>
      <div className={`${styles["my-pets-container"]} ${"container"}`}>
        <div className={styles["my-pets-header"]}>
          <h1>My Pets</h1>
        </div>
        <div className={styles["my-pets-container-pets"]}>
          {loading ? (
            <Spinner />
          ) : (
            <>
              <AddPetCard viewAdditionModal={viewAdditionModal} />
              {myPets &&
                myPets.map((pet) => (
                  <MyPetCard key={pet.profile_id} pet={pet} />
                ))}
            </>
          )}
        </div>
      </div>
      {/* Modals */}
      <ConfirmDeletion
        display={deletionModalDisplay}
        onClose={() => setDeletionModalDisplay(false)}
        selectedPet={selectedPet}
        deleteAction={deletePet}
      />
      <AddAPet
        display={additionModalDisplay}
        onClose={() => setAdditionModalDisplay(false)}
        typeOptions={typeOptions}
        dogBreedOptions={dogBreedOptions}
        catBreedOptions={catBreedOptions}
        colorOptions={colorOptions}
        sizeOptions={sizeOptions}
        ageOptions={ageOptions}
        // update={() => setUpdate(!update)}
      />
    </>
  );
}

export default MyPets;
