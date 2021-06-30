import { useContext, useState } from "react";

import EditAddress from "../../components/Modals/EditAddress";

import Tab from "./Tab/Tab";
import EditButton from "../Buttons/EditButton";

import styles from "./AboutMe.module.css";

import EditBusinessHours from "../../components/Modals/EditBusinessHours";
import axios from "axios";
import BusinessInfo from "./BusinessInfo";
import { ProfileContext } from "../../pages/Profile/ProfileProvider";

const shelterProfileTabs = ["About", "Contact Info"]; //, "Recent Posts"]
const businessProfileTabs = ["About", "Business Info"]; //, "Recent Posts"]
const petOwnerProfileTabs = ["About"]; //, "Recent Posts"]

function AboutMe() {
  const { profile, profileID, editAboutMe } = useContext(ProfileContext);
  ////console.log('profile', profile)
  ////console.log('profileID', profileID)

  const [selected, setSelected] = useState("About");
  const [changing, setChanging] = useState(false);
  const [labelSelected, setLabelSelected] = useState();

  const [editHoursDisplay, setEditHoursDisplay] = useState(false);
  const [editAddressDisplay, setEditAddressDisplay] = useState(false);

  function displayEditHoursModal() {
    setEditHoursDisplay(true);
  }

  function displayEditAddressModal() {
    setEditAddressDisplay(true);
  }

  function submitAboutMeEdit() {
    axios
      .put("/api/profile/about-me", {
        newAboutMe: profile.aboutMe,
        profileID: profileID,
      })
      .then((response) => {
        ////console.log(response);
      })
      .catch((err) => {
        ////console.log(err);
      });
  }

  function onTabClickHandler(id) {
    setSelected(id);
  }

  function changingInfoHandler(label) {
    setChanging(true);
    setLabelSelected(label);
  }

  function cancelEditingHandler() {
    setChanging(false);
    setLabelSelected("");
  }

  let profileTabs = null;
  switch (profile.profileType) {
    case "Shelter":
      profileTabs = shelterProfileTabs;
      break;
    case "Business":
      profileTabs = businessProfileTabs;
      break;
    case "PetOwner":
      profileTabs = petOwnerProfileTabs;
      break;
    case "Pet":
      profileTabs = petOwnerProfileTabs;
      break;
    default:
      profileTabs = ["No Tabs"];
  }

  let tabs = profileTabs.map((tab) => (
    <Tab
      key={tab}
      id={tab}
      section={tab}
      selected={selected}
      clicked={onTabClickHandler}
      accountType={profile.profileType}
    />
  ));

  let content = null;
  switch (selected) {
    case "About":
      content = (
        <>
          <textarea
            className={styles["text-area"]}
            value={profile.aboutMe}
            onChange={(event) => editAboutMe(event.target.value)}
            readOnly={!changing || !(labelSelected === "about")}
          />
          {profile.selfView &&
            (labelSelected !== "about" ? (
              <EditButton
                style={{ fontSize: "var(--h5)" }}
                edit
                clicked={() => changingInfoHandler("about")}
              >
                Edit
              </EditButton>
            ) : (
              <EditButton
                style={{ fontSize: "var(--h5)" }}
                save
                clicked={() => {
                  cancelEditingHandler();
                  submitAboutMeEdit();
                }}
              >
                Save
              </EditButton>
            ))}
        </>
      );
      break;
    case "Contact Info":
    case "Business Info":
      content = (
        <BusinessInfo
          displayEditHoursModal={displayEditHoursModal}
          labelSelected={labelSelected}
          displayEditAddressModal={displayEditAddressModal}
          changing={changing}
          changingInfoHandler={changingInfoHandler}
          cancelEditingHandler={cancelEditingHandler}
        />
      );
      break;
    default:
      content = <span>Error</span>;
  }

  return (
    <>
      <div className={styles["about-me"]}>
        <div style={{ display: "flex", flexDirection: "column" }}>{tabs}</div>
        <div className={styles["about-me-card"]}>{content}</div>
      </div>

      {/* Modals */}
      <EditBusinessHours
        display={editHoursDisplay}
        onClose={() => {
          cancelEditingHandler();
          setEditHoursDisplay(false);
        }}
      />
      <EditAddress
        display={editAddressDisplay}
        onClose={() => setEditAddressDisplay(false)}
      />
    </>
  );
}

export default AboutMe;
