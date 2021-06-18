//Import Libraries
import { useCallback, useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";

//Import UI Components
import Loader from "../UI/Spinner/ButtonLoader";

//Import CSS
import styles from "./ProfilePic.module.css";

//make this into environment variable before deploying!
const apiGatewayURL = process.env.REACT_APP_API_GATEWAY;
const s3URL = process.env.REACT_APP_IMAGE_STORAGE;

function ProfilePic({ profile, isSelfView }) {
  console.log(apiGatewayURL);

  //states
  const [loading, setLoading] = useState(false);
  const [profilePic, setProfilePic] = useState(profile.profile_pic_link);

  const onDrop = useCallback((acceptedFile) => {
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
                setProfilePic(presignedFileURL);
                setLoading(false);
              })
              .catch((err) => {
                setLoading(false);
              });
          })
          .catch((err) => {
            setLoading(false);
            if (err.response.status == 403) {
              //display error message to user
            }
            //break out of this function //presigned s3 url will automatically expire so no harm done
          });
      })
      .catch((err) => {
        setLoading(false);
      });
  });

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
        src={profilePic}
        alt="No Image Found"
      />
      {isSelfView && (
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
