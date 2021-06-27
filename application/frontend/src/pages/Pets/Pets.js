//Import Libraries
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import styles from "./MyPets.module.css"; //same style as my pets without add pet button

//Import UI Components
import PetCard from "../../components/Cards/PetCard/PetCard";
import Spinner from "../../components/UI/Spinner/Spinner";

function Pets() {
  const { profileID } = useParams();

  const [pets, setPets] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const getPets = axios.get("/api/pets", { params: { profileID } });

    const getDisplayName = axios.get("/api/profile-display-name", {
      params: { profileID },
    });

    Promise.all([getPets, getDisplayName])
      .then((res) => {
        setPets(res[0].data);
        setName(res[1].data.display_name);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [profileID]);

  return (
    <>
      <div className={`${styles["my-pets-container"]} ${"container"}`}>
        {loading ? (
          <Spinner />
        ) : (
          <>
            <div className={styles["my-pets-header"]}>
              <h1>{name + "'s Pets"}</h1>
            </div>
            <div className={styles["my-pets-container-pets"]}>
              {pets.length === 0 && (
                <div className={styles["my-pets-container-no-pets"]}>
                  This User has No Pets :(
                </div>
              )}
              {pets &&
                pets.map((pet) => <PetCard key={pet.profile_id} pet={pet} />)}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Pets;
