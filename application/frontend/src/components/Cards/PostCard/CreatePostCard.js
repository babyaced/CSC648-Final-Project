//Import Libraries
import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { useHistory } from "react-router";
import { useDropzone } from "react-dropzone";

//import CSS
import styles from "./CreatePostCard.module.css";

//Import UI Components
import ButtonLoader from "../../UI/Spinner/ButtonLoader";

//Import Mods
import SelectCustomTheme from "../../../mods/SelectCustomTheme";

//Import Custom Hooks
import useWindowSize from "../../Hooks/useWindowSize";

const apiGatewayURL = process.env.REACT_APP_API_GATEWAY;
const s3URL = process.env.REACT_APP_IMAGE_STORAGE;

function CreatePostCard({
  displayName,
  profilePic,
  tagOptions,
  updateFeedPostsState,
}) {
  //console.log(apiGatewayURL);
  const history = useHistory();

  const windowSize = useWindowSize();

  //creating a post display

  const [createdPostBody, setCreatedPostBody] = useState();

  //image upload array
  const [myFiles, setMyFiles] = useState([]);

  const [loading, setLoading] = useState(false);

  //storing the pets that are tagged in each post to send to db
  const [taggedPets, setTaggedPets] = useState([]);

  const onDrop = useCallback(
    (acceptedFiles) => {
      setMyFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
    [myFiles]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxSize: 5242880,
    accept: "image/jpeg",
    multiple: false,
  });

  const removeAll = () => {
    setMyFiles([]);
  };

  useEffect(
    () => () => {
      //revoke the data urls to avoid memory leaks
      myFiles.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [myFiles]
  );

  let customStyles = {
    control: (base, state) => ({
      ...base,
      height: "54.5px",
      "min-height": "54.5px",
      "border-radius": "7.5px",
      overflowY: "auto",
    }),
  };

  if (windowSize.width < 768) {
    customStyles = {
      control: (base, state) => ({
        ...base,
        height: "35px",
        "min-height": "35px",
        "border-radius": "7.5px",
      }),
    };
  }

  function submitPost(event) {
    event.preventDefault();
    let config = {
      headers: {
        "Content-type": "image/jpeg", //configure headers for put request to s3 bucket
      },
    };

    setLoading(true);
    if (myFiles.length !== 0) {
      //try to upload photo first
      axios
        .get(
          "https://5gdyytvwb5.execute-api.us-west-2.amazonaws.com/default/getPresignedURL"
        ) //first get the presigned s3 url
        .then((response) => {
          let presignedFileURL = s3URL + response.data.photoFilename; //save this url to add to database later
          axios
            .put(response.data.uploadURL, myFiles[0], config)
            .then((response) => {
              //upload the file to s3
              axios
                .post("/api/upload-post", {
                  postBody: createdPostBody,
                  photoLink: presignedFileURL,
                  taggedPets: taggedPets,
                })
                .then((res) => {
                  console.log("res.data: ", res.data);
                  removeAll();
                  setCreatedPostBody("");
                  setTaggedPets([]);
                  updateFeedPostsState(res.data);
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

      //refresh feed after posting
      // getPosts();
      // setFeedPosts([...feedPosts, ])
    } else {
      axios
        .post("/api/upload-post", {
          postBody: createdPostBody,
          taggedPets: taggedPets,
        })
        .then((res) => {
          console.log("res.data: ", res.data);
          setCreatedPostBody("");
          setTaggedPets([]);
          updateFeedPostsState(res.data);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
        });

      //refresh feed after posting
      //getPosts();
    }
  }

  return (
    <form className={styles["create-post-card"]} onSubmit={submitPost}>
      <img
        className={styles["new-post-profile-pic"]}
        src={profilePic}
        alt="Created Post User"
      />
      <div className={styles["new-post-name"]}>{displayName}</div>
      <textarea
        value={createdPostBody}
        maxLength="255"
        required
        className={styles["follower-feed-new-post-body"]}
        placeholder="Update your followers on what's going on with you and your pets"
        onChange={(e) => setCreatedPostBody(e.target.value)}
      />
      <div className={styles["follower-feed-new-post-tag-dropdown"]}>
        <Select
          onChange={setTaggedPets}
          options={tagOptions}
          placeholder="Tag a Pet in your Post"
          theme={SelectCustomTheme}
          styles={customStyles}
          isSearchable
          isMulti
          value={taggedPets}
          noOptionsMessage={() =>
            "Add a Pet to Your Account on the My Pets Page"
          }
        />
      </div>
      <section className={styles["attach-image-section"]}>
        <div className={styles["attach-image-container"]} {...getRootProps()}>
          <input {...getInputProps()} />
          {myFiles.length === 0 && (
            <div className={styles["attach-image-info"]}>
              {windowSize.width > 768 && (
                <>Drag and Drop or Click to Select Image</>
              )}
              {windowSize.width <= 768 && <>Attach Image</>}
            </div>
          )}
          {myFiles.length > 0 && (
            <>
              <img
                className={styles["attach-image-preview"]}
                src={myFiles[0].preview}
                onClick={removeAll}
                alt="attach"
              />
              <button
                className={styles["delete-attached-image-button"]}
                onClick={removeAll}
              >
                Remove
              </button>
            </>
          )}
        </div>
      </section>
      <button className={styles["submit-post-button"]} type="submit">
        {loading ? <ButtonLoader /> : "Submit"}
      </button>
    </form>
  );
}

export default CreatePostCard;
