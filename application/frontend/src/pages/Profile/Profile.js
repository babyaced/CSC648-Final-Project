import { useContext, useEffect, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";

// Import components
import ProfileInfo from "../../components/ProfileInfo/ProfileInfo";
import ProfileContent from "../../components/ProfileContent/ProfileContent";
import AboutMe from "../../components/AboutMe/AboutMe";
import Spinner from "../../components/UI/Spinner/Spinner";
import { RedirectPathContext } from "../../context/redirect-path";
import ImageContainer from "../../components/ProfileContent/ImageContainer/ImageContainer";

import styles from "./Profile.module.css";
import axios from "axios";

import { ProfileContext } from './ProfileProvider';

function Profile({ appUser }) {
  const { profile, profileID, loading, updateProfileHandler } = useContext(ProfileContext)
  console.log(loading);

  if (profile) {
    console.log(profile)
  }

  // switch profile type by changing the userProfile Ex: shelterProfile, businessProfile, newBusinessProfile and petOwnerProfile



  return (
    <div className={`${styles["Profile"]} ${"wide-container"}`}>
      <>
        <div className={styles["profile-info"]}>
          <ProfileInfo
            appUser={appUser}
            isSelfView={profile.selfView}
            profile={profile.profileInfo}
            updateProfile={updateProfileHandler}
            followingStatus={profile.followingStatus}
            isAdminView={profile.adminView}
          />
        </div>
        <div className={styles["about-me"]}>
          <AboutMe
            aboutMeBody={profile.about_me}
            hours={profile.hours}
            phoneNumber={profile.phoneNumber}
            address={profile.address}
            isSelfView={profile.selfView}
            profile={profile.profileInfo}
            profileID={profileID}
            updateProfile={updateProfileHandler}
          />
        </div>
        {(profile.profileInfo.type === "Admin" ||
          profile.profileInfo.type === "PetOwner" ||
          profile.profileInfo.type === "Shelter") && (
            <>
              <div className={styles["photo-previews"]}>
                <ImageContainer
                  title="Photos"
                  previews={profile.fetchedPhotoPosts}
                  selfView={profile.selfView}
                  type={profile.profileInfo.type}
                  profile={profile.profileInfo}
                />
              </div>
              <div className={styles["pet-previews"]}>
                <ImageContainer
                  title="Pets"
                  previews={profile.fetchedPets}
                  type={profile.profileInfo.type}
                  profile={profile.profileInfo}
                />
              </div>
            </>
          )}
        {profile.profileInfo.type === "Pet" && (
          <>
            <div className={styles["photo-previews"]}>
              <ImageContainer
                title="Photos"
                previews={profile.taggedPosts}
                selfView={profile.selfView}
                type={profile.profileInfo.type}
                profile={profile.profileInfo}
              />
            </div>
            <div className={styles["pet-previews"]}>
              <ImageContainer
                title="Siblings"
                previews={profile.fetchedPets}
                type={profile.profileInfo.type}
                profile={profile.profileInfo}
              />
            </div>
          </>
        )}
      </>

    </div>
  );
}

export default Profile;
