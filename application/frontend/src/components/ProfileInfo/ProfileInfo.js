import { useContext, useState, useEffect } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";

//css
import arrow from "../../assets/icons/created/Arrow.svg";
import styles from "./ProfileInfo.module.css";

//component
import SendProfileMessage from "../../components/Modals/SendProfileMessage";
import EditPetDetails from "../Modals/EditPetDetails";
import EditButton from "../Buttons/EditButton";
import LoginRequired from "../Modals/LoginRequired";

//context
import { RedirectPathContext } from "../../context/redirect-path";

import axios from "axios";
import ConfirmDeletion from "../Modals/ConfirmDeletion";
import ProfilePic from "./ProfilePic";
import FollowMenu from "./FollowMenu";
import useTypeOptions from "../DropdownOptions/useTypeOptions";
import useColorOptions from "../DropdownOptions/useColorOptions";
import useAgeOptions from "../DropdownOptions/useAgeOptions";
import useSizeOptions from "../DropdownOptions/useSizeOptions";
import useDogBreedOptions from "../DropdownOptions/useDogBreedOptions";
import useCatBreedOptions from "../DropdownOptions/useCatBreedOptions";
import { ProfileContext } from "../../pages/Profile/ProfileProvider";

function ProfileInfo() {
  const { profile, appUser, editName } = useContext(ProfileContext)
  console.log('profile in profileInfo', profile)


  const [editing, setEditing] = useState(false);

  const [follow, setFollow] = useState(profile.followingStatus); // update this from backend

  const [sendAMessageDisplay, setSendAMessageDisplay] = useState(false);
  const [editPetDetailsDisplay, setEditPetDetailsDisplay] = useState(false);
  const [loginRequiredDisplay, setLoginRequiredDisplay] = useState(false);
  const [deletionModalDisplay, setDeletionModalDisplay] = useState(false);

  const history = useHistory();
  const location = useLocation();

  function editHandler() {
    //console.log(profile.profileType)
    //console.log('clicked')
    profile.profileType === "Pet" ? setEditPetDetailsDisplay(true) : setEditing(true);
  }

  function cancelEditHandler() {
    axios
      .post("/api/name", {
        newFirstName: profile.displayName,
      })
      .then((res) => { });

    setEditing(false);
  }

  function sendAMessage() {
    if (appUser) {
      setSendAMessageDisplay(true);
    } else {
      setLoginRequiredDisplay(true);
    }
  }

  function banUser() {
    axios
      .post("/api/ban-user", {
        profileID: profile.profile_id,
      })
      .then((res) => {
        setDeletionModalDisplay(false);
        history.push("/Feed");
      })
      .catch((err) => {
        //console.log(err);
      });
  }

  function onFollowHandler() {
    if (appUser) {
      axios.post("/api/follow-unfollow-user", {
        accountId: profile.account_id,
      });
      setFollow(!follow);
    } else {
      setLoginRequiredDisplay(true);
    }
  }

  let nameDisplay = null;
  let buttons = null;
  switch (profile.profileType) {
    case "Shelter":
    case "Business":
    case "PetOwner":
      buttons = (
        <>
          {!profile.selfView ? (
            <FollowMenu
              followingProfileOwnerFlag={follow}
              profile={profile}
              onFollowHandler={onFollowHandler}
            />
          ) : (
            <button
              className={styles.Button}
              onClick={() => history.push(`/Followers/${profile.profile_id}`)}
            >
              Followers
            </button>
          )}
          {!profile.selfView && (
            <button className={styles.Button} onClick={sendAMessage}>
              Message
            </button>
          )}
        </>
      );
      break;
    case "Pet":
      nameDisplay = (
        <>
          <div style={{ display: "flex" }}>
            <h1 className={styles.UserName}>{profile.displayName}</h1>
            {/* <h3 style={{marginLeft: '10px'}} >
                            {petType.value ? petType.value : 'Type'}
                            /
                            {petBreeds[0].value ? petBreeds[0].value : 'Breed'}
                        </h3> */}
          </div>
        </>
      );
      buttons = (
        <>
          {!profile.selfView ? (
            <FollowMenu
              followingProfileOwnerFlag={follow}
              profile={profile}
              onFollowHandler={onFollowHandler}
            />
          ) : (
            <button
              className={styles.Button}
              onClick={() => history.push(`/Followers/${profile.profile_id}`)}
            >
              Followers
            </button>
          )}
          {!profile.selfView && (
            <>
              <button
                className={styles.Button}
                onClick={() => history.push("/Profile/" + profile.reg_user_id)}
              >
                My Owner
              </button>
              <button className={styles.Button} onClick={sendAMessage}>
                Message
              </button>
            </>
          )}
        </>
      );
      break;
    default:
      buttons = null;
  }

  return (
    <div className={styles["profile-header"]}>
      <div className={styles["profile-pic-container"]}>
        <ProfilePic isSelfView={profile.selfView} profile={profile.profileInfo} />
      </div>
      <div className={styles["display-name-container"]}>
        <h1 className={styles["display-name"]}>
          <input
            value={profile.displayName}
            readOnly={!editing}
            maxLength="25"
            onChange={(event) => editName(event.target.value)}
          />
        </h1>
      </div>
      <div className={styles["save-edit-button-wrapper"]}>
        {profile.selfView && !editing && (
          <button
            onClick={() => editHandler()}
          >
            Edit
          </button>
        )}
        {profile.selfView && editing && (
          <button onClick={cancelEditHandler}
          >
            Save
          </button>
        )}
      </div>
      <div className={styles["button-container"]}>
        {buttons}
        {profile.adminView && !profile.selfView && (
          <button
            className={styles["ban-button"]}
            onClick={() => setDeletionModalDisplay(true)}
          >
            Ban User
          </button>
        )}
      </div>

      {/* Modals */}
      {profile.type === "Pet" && (
        <EditPetDetails
          display={editPetDetailsDisplay}
          onClose={() => setEditPetDetailsDisplay(false)}
        />
      )}

      {/* Modals */}
      <SendProfileMessage
        display={sendAMessageDisplay}
        profile={profile}
        onClose={() => setSendAMessageDisplay(false)}
      />
      <LoginRequired
        display={loginRequiredDisplay}
        onClose={() => setLoginRequiredDisplay(false)}
        redirect={location.pathname}
      />
      <ConfirmDeletion
        display={deletionModalDisplay}
        onClose={() => setDeletionModalDisplay(false)}
        message={"Ban " + profile.display_name + "'s account ?"}
        deleteAction={banUser}
      />
    </div>
  );
}

export default ProfileInfo;
