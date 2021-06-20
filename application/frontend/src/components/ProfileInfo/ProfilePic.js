//Import Libraries
import { useCallback, useContext, useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";

//Import UI Components
import Loader from "../UI/Spinner/ButtonLoader";

//Import CSS
import styles from "./ProfilePic.module.css";
import { ProfileContext } from "../../pages/Profile/ProfileProvider";

//make this into environment variable before deploying!
const apiGatewayURL = process.env.REACT_APP_API_GATEWAY;
const s3URL = process.env.REACT_APP_IMAGE_STORAGE;

function ProfilePic() {
  console.log(apiGatewayURL);

  const { profile, editProfilePic } = useContext(ProfileContext)

  //states
  const [loading, setLoading] = useState(false);

  const onDrop = (acceptedFile) => {
    let config = {
      headers: {
        "Content-type": "image/jpeg", //configure headers for put request to s3 bucket
      },
    };

    setLoading(true);
    axios
      .get(apiGatewayURL) //first get the presigned s3 url
      .then((response) => {
        let presignedFileURL = s3URL + response.data.photoFilename; //save this url to add to database later
        axios
          .put(response.data.uploadURL, acceptedFile[0], config)
          .then((response) => {
            //upload the file to s3
            axios
              .post("/api/profile-pic", {
                photoLink: presignedFileURL,
                profileID: profile.profile_id,
                profileType: profile.type,
              })
              .then((response) => {
                editProfilePic(presignedFileURL);
                setLoading(false);
              })
              .catch((err) => {
                setLoading(false);
              });
          })
          .catch((err) => {
            setLoading(false);
            if (err.response.status === 403) {
              //display error message to user
            }
            //break out of this function //presigned s3 url will automatically expire so no harm done
          });
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const { getRootProps, getInputProps } = useDropzone({
    //props for dropzone for
    onDrop,
    maxSize: 5242880,
    accept: "image/jpeg",
    multiple: false,
  });

  return (
    <>
      <img
        className={styles["profile-pic"]}
        src={profile.profilePic}
        alt="Profile Pic"
      />
      {profile.selfView && (
        <div className={styles["editable-profile-pic-overlay"]}>
          <section>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <div>{loading ? <Loader /> : "Edit"}</div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

export default ProfilePic;
