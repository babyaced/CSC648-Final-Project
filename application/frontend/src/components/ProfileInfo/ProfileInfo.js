import { useContext, useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";

//css
import styles from "./ProfileInfo.module.css";

//component
import SendProfileMessage from "../../components/Modals/SendProfileMessage";
import EditPetDetails from "../Modals/EditPetDetails";
import LoginRequired from "../Modals/LoginRequired";

import axios from "axios";
import ConfirmDeletion from "../Modals/ConfirmDeletion";
import ProfilePic from "./ProfilePic";
import FollowMenu from "./FollowMenu";
import { ProfileContext } from "../../pages/Profile/ProfileProvider";

import EditButton from "../Buttons/EditButton";
import ServerErrorModal from "../Modals/ServerErrorModal";

function ProfileInfo() {
  const { profile, appUser, editName } = useContext(ProfileContext);
  //console.log("profile in profileInfo", profile);

  const [editing, setEditing] = useState(false);

  const [follow, setFollow] = useState(profile.followingStatus); // update this from backend

  const [sendAMessageDisplay, setSendAMessageDisplay] = useState(false);
  const [editPetDetailsDisplay, setEditPetDetailsDisplay] = useState(false);
  const [loginRequiredDisplay, setLoginRequiredDisplay] = useState(false);
  const [deletionModalDisplay, setDeletionModalDisplay] = useState(false);

  const [serverErrorModalDisplay, setServerErrorModalDisplay] = useState(true);

  const history = useHistory();
  const location = useLocation();

  function editHandler() {
    //console.log(profile.profileType);
    //console.log("clicked");
    profile.profileType === "Pet"
      ? setEditPetDetailsDisplay(true)
      : setEditing(true);
  }

  function cancelEditHandler() {
    axios
      .put("/api/profile/name", {
        newFirstName: profile.displayName,
      })
      .then((res) => {})
      .catch((err) => {
        if (err.response.status === 500) {
          setServerErrorModalDisplay(true);
        }
      });

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
      .post("/api/admin/ban", {
        profileID: profile.profile_id,
      })
      .then((res) => {
        setDeletionModalDisplay(false);
        history.push("/Feed");
      })
      .catch((err) => {
        ////console.log(err);
      });
  }

  function onFollowHandler() {
    if (appUser) {
      axios.post("/api/follow", {
        accountId: profile.accountId,
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
            <h3>
              the
              {profile.petType.value ? profile.petType.value : "Type"}
              {/* /
                {profile.petBreeds[1].value ? profilepetBreeds[0].value : 'Breed'} */}
            </h3>
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
              {/* <button
                className={styles.Button}
                onClick={() => history.push("/Profile/" + profile.reg_user_id)}
              >
                My Owner
              </button> */}
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

  // let bgImage = null;
  // if () {
  //   bgImage = profile.profilePic;
  // }

  return (
    <>
      <div className={styles["profile-header"]}>
        <div className={styles["profile-pic-container"]}>
          <ProfilePic
            isSelfView={profile.selfView}
            profile={profile.profileInfo}
          />
        </div>
        <div className={styles["display-name-container"]}>
          <h1 className={styles["display-name"]}>
            {profile.profileType === "Pet" && (
              <input
                value={
                  profile.displayName +
                  " the" +
                  (profile.petType.value ? " " + profile.petType.label : "Type")
                }
                readOnly={!editing}
                maxLength="25"
                onChange={(event) => editName(event.target.value)}
              />
            )}
            {profile.profileType !== "Pet" && (
              <input
                value={profile.displayName}
                readOnly={!editing}
                maxLength="25"
                onChange={(event) => editName(event.target.value)}
              />
            )}
          </h1>
          {profile.profileType === "Pet" && (
            <div className={styles["display-name-subtitle"]}></div>
          )}
        </div>
        <div className={styles["save-edit-button-wrapper"]}>
          {profile.selfView && !editing && (
            <EditButton edit clicked={() => editHandler()}>
              Edit
            </EditButton>
          )}
          {profile.selfView && editing && (
            <button onClick={cancelEditHandler}>Save</button>
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
        {profile.profileType === "Pet" && (
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
      <ServerErrorModal
        display={serverErrorModalDisplay}
        onClose={() => setServerErrorModalDisplay(false)}
      >
        Please try submitting your Edit Again
      </ServerErrorModal>
    </>
  );
}

export default ProfileInfo;
