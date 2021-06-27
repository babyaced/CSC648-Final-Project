import React, { useContext, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";

import styles from "./ImageContainer.module.css";

import PostModal from "../../Modals/PostModal";
import { ProfileContext } from "../../../pages/Profile/ProfileProvider";

function ImageContainer({ title, previews }) {
  // //console.log('previews',previews);

  const { profile } = useContext(ProfileContext);
  const [postModalDisplay, setPostModalDisplay] = useState(false);
  const [selectedPost, setSelectedPost] = useState({});

  //console.log('profile: imageContainer: ', profile)
  //console.log("previews:", previews);

  let history = useHistory();

  function closePostModal() {
    setPostModalDisplay(false);
  }

  function presentPostModal(index) {
    setSelectedPost(previews[index]);
    setPostModalDisplay(true);
  }

  let limitedPreviews = previews;
  if (previews.length > 5) {
    limitedPreviews = previews.slice(0, 5);
  }

  let seeAll = null;
  let placeholder = null;
  if (title === "Photos") {
    placeholder = <h3>No Photos</h3>;
    profile.selfView //this won't work because the user will still able to go to photos/:profileId by directUrl, it will be better to check ownership on the page itself
      ? (seeAll = (
          <Link
            className={styles["see-all-link"]}
            to={"/Photos/" + profile.profileId}
          >
            See All
          </Link>
        ))
      : (seeAll = (
          <Link
            className={styles["see-all-link"]}
            to={"/Photos/" + profile.profileId}
          >
            See All
          </Link>
        ));
  } else if (title === "Pets" || title === "Siblings") {
    placeholder = <h3>No Pets</h3>;
    seeAll = (
      <Link
        className={styles["see-all-link"]}
        to={"/Pets/" + profile.profileId}
      >
        See All
      </Link>
    );
  } else {
    placeholder = <h3>No Siblings to show</h3>;
    seeAll = (
      <Link
        className={styles["see-all-link"]}
        to={"/Pets/" + profile.profileId}
      >
        See All
      </Link>
    );
  }

  if (limitedPreviews.length === 0) seeAll = null;

  //console.log('placeholder:', placeholder)
  //console.log('seeAll', seeAll)

  return (
    <>
      <h2>{title}</h2>
      <div className={styles["preview-stack"]}>
        {limitedPreviews.length === 0 && placeholder}
        {limitedPreviews.length > 0 &&
          limitedPreviews.map((preview, index) => {
            let displayPostModal;
            if (
              title === "Siblings" ||
              title === "My Pets" ||
              title === "Pets"
            ) {
              displayPostModal = (
                <div
                  className={styles.previewCard}
                  onClick={() => history.push("/Profile/" + preview.profile_id)}
                  key={preview.profile_id}
                >
                  <img src={preview.profile_pic_link} alt="Not Found" />
                  <div className={styles.previewCardNamePlate}>
                    {limitedPreviews[index].display_name}
                  </div>
                </div>
              );
            } else {
              displayPostModal = (
                <div
                  onClick={() => presentPostModal(index)}
                  key={preview.photo_id}
                >
                  <img src={preview.link} alt="Not Found" />
                </div>
              );
            }
            return displayPostModal;
          })}
        {seeAll}
      </div>
      {/* Modals */}
      <PostModal
        display={postModalDisplay}
        onClose={closePostModal}
        selectedPost={selectedPost}
      />
    </>
  );
}

export default ImageContainer;
