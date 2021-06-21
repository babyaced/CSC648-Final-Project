import React, { useContext } from "react";
import axios from "axios";

import styles from "./BusinessInfo.module.css";

//import UI Components
import EditButton from "../Buttons/EditButton";
import { ProfileContext } from "../../pages/Profile/ProfileProvider";

function BusinessInfo({
  displayEditHoursModal,
  displayEditAddressModal,
  labelSelected,
  changing,
  changingInfoHandler,
  cancelEditingHandler,
}) {
  const { profile, editPhoneNumber } = useContext(ProfileContext);

  function submitPhoneEdit() {
    axios
      .post("/api/phone-number", {
        newPhoneNumber: profile.phoneNumber,
      })
      .then((response) => {
        //console.log(response);
      })
      .catch((err) => {
        //console.log(err);
      });
  }

  console.log("Profile in BusinessInfo", profile);
  return (
    <div className={styles["business-info-container"]}>
      <div className={styles["address-container"]}>
        {profile.selfView && labelSelected !== "address" && (
          <EditButton edit clicked={() => displayEditAddressModal()}>
            Edit
          </EditButton>
        )}
        <label for="tab-address">Address:</label>
        <textarea
          id="tab-address"
          value={profile.address}
          readOnly={!changing || !(labelSelected === "address")}
          className={styles["address-text-area"]}
        />
        {profile.selfView && labelSelected !== "phone number" && (
          <EditButton edit clicked={() => changingInfoHandler("phone number")}>
            Edit
          </EditButton>
        )}
      </div>
      <div className={styles["phone-number-container"]}>
        <label for="phone">Phone Number: </label>
        <input
          id="phone"
          type="tel"
          // value={`(${phone.substring(0,3)}) ${phone.substring(3,6)}-${phone.substring(6,10)}`}
          value={profile.phoneNumber}
          readOnly={!changing || !(labelSelected === "phone number")}
          maxLength="10"
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              cancelEditingHandler();
              submitPhoneEdit();
            }
          }}
          onChange={(event) => editPhoneNumber(event.target.value)}
        />
        {labelSelected === "phone number" && (
          <EditButton
            save
            clicked={() => {
              cancelEditingHandler();
              submitPhoneEdit();
            }}
          >
            Save
          </EditButton>
        )}
      </div>
      <div className={styles["hours-container"]}>
        {profile.selfView && labelSelected !== "hours" && (
          <EditButton
            edit
            clicked={() => {
              displayEditHoursModal();
            }}
          >
            Edit
          </EditButton>
        )}
        <label>Hours:</label>
        <table className={styles["hours-table"]}>
          {Object.keys(profile.hours).map((key, index) => {
            if (index % 2 === 1) return null;

            let day = key.substr(0, 3);

            return (
              <tr className={styles["hours-table-row"]} key={key}>
                <th className={styles["hours-table-cell-header"]}>
                  {day[0].toUpperCase() + day.substring(1)}:{" "}
                </th>
                <td className={styles["hours-table-cell"]}>
                  {profile.hours[key].value !== "00:00:00" ? (
                    <span>
                      {profile.hours[key].label +
                        " - " +
                        profile.hours[day + "_close"].label}
                    </span>
                  ) : (
                    <span>Closed</span>
                  )}
                </td>
              </tr>
            );
          })}
        </table>
      </div>
    </div>
  );
}

export default BusinessInfo;
