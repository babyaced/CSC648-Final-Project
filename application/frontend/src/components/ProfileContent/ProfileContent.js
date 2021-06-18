import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import ImageContainer from "./ImageContainer/ImageContainer";
import Reviews from "./Reviews/Reviews";
import WriteAReview from "../Modals/WriteAReview";

import styles from "./ProfileContent.module.css";
import axios from "axios";

function ProfileContent({
  photoPosts,
  pets,
  profile,
  isSelfView,
  updateProfile,
  taggedPosts,
}) {
  const [writeAReviewDisplay, setWriteAReviewDisplay] = useState(false);
  const [text, setText] = useState("See All");

  let imageContainers = null;
  switch (profile.type) {
    case "Shelter":
      imageContainers = (
        <>
          <ImageContainer
            title="Photos"
            previews={photoPosts}
            selfView={isSelfView}
            type={profile.type}
            profile={profile}
          />
          <ImageContainer
            title="Pets"
            previews={pets}
            type={profile.type}
            profile={profile}
          />
        </>
      );
      break;
    case "Business":
      imageContainers = (
        <ImageContainer
          title="Photos"
          selfView={isSelfView}
          previews={photoPosts}
          type={profile.type}
          profile={profile}
        />
      );
      break;
    case "Admin":
    case "PetOwner":
      imageContainers = (
        <>
          <ImageContainer
            title="Photos"
            previews={photoPosts}
            selfView={isSelfView}
            image={profile.photos}
            type={profile.type}
            profile={profile}
          />
          <ImageContainer
            title="Pets"
            previews={pets}
            type={profile.type}
            profile={profile}
          />
        </>
      );
      break;
    case "Pet":
      imageContainers = (
        <>
          <ImageContainer
            title="Photos"
            previews={taggedPosts}
            selfView={isSelfView}
            type={profile.type}
            profile={profile}
          />
          <ImageContainer
            title="Siblings"
            previews={pets}
            type={profile.type}
            profile={profile}
          />
        </>
      );
      break;
    default:
      imageContainers = null;
  }

  let displayReview = null;

  return <>{imageContainers}</>;
}

export default ProfileContent;
