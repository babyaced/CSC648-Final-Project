import { useContext } from "react";

// Import components
import ProfileInfo from "../../components/ProfileInfo/ProfileInfo";
import AboutMe from "../../components/AboutMe/AboutMe";
import ImageContainer from "../../components/ProfileContent/ImageContainer/ImageContainer";

import styles from "./Profile.module.css";

import { ProfileContext } from "./ProfileProvider";

function Profile({ appUser }) {
  const { profile } = useContext(ProfileContext);

  console.log("profile:", profile);

  // switch profile type by changing the userProfile Ex: shelterProfile, businessProfile, newBusinessProfile and petOwnerProfile

  return (
    <div className={`${styles["Profile"]} ${"wide-container"}`}>
      <>
        <div className={styles["profile-info"]}>
          <ProfileInfo />
        </div>
        <div className={styles["about-me"]}>
          <AboutMe />
        </div>
        {(profile.profileType === "Admin" ||
          profile.profileType === "PetOwner" ||
          profile.profileType === "Shelter" ||
          profile.profileType === "Business") && (
          <>
            <div className={styles["photo-previews"]}>
              <ImageContainer
                title="Photos"
                previews={profile.fetchedPhotoPosts}
              />
            </div>
          </>
        )}
        {(profile.profileType === "Admin" ||
          profile.profileType === "PetOwner" ||
          profile.profileType === "Shelter") && (
          <>
            <div className={styles["pet-previews"]}>
              <ImageContainer title="Pets" previews={profile.fetchedPets} />
            </div>
          </>
        )}

        {profile.profileType === "Pet" && (
          <>
            <div className={styles["photo-previews"]}>
              <ImageContainer title="Photos" previews={profile.taggedPosts} />
            </div>
            <div className={styles["pet-previews"]}>
              <ImageContainer title="Siblings" previews={profile.fetchedPets} />
            </div>
          </>
        )}
      </>
    </div>
  );
}

export default Profile;
