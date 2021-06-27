//Import React Libraries
import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";

//Import Other Libraries
import axios from "axios";

//Import Stylesheets
import styles from "./Photos.module.css";

//Import Compound Components
import PostModal from "../../components/Modals/PostModal";

//Import Atomic Components
import Spinner from "../../components/UI/Spinner/Spinner";

//Import Non-UI Components
import { RedirectPathContext } from "../../context/redirect-path";

function Photos() {
  const { profileID } = useParams(); //get profileID from '/Photos/:profileID url

  const [name, setName] = useState("");
  const [photos, setPhotos] = useState([]);

  const redirectContext = useContext(RedirectPathContext);

  useEffect(() => {
    redirectContext.updateLoading(true);
    const getPhotos = axios.get("/api/photo-posts", { params: { profileID } });

    const getDisplayName = axios.get("/api/profile-display-name", {
      params: { profileID },
    });

    Promise.all([getPhotos, getDisplayName])
      .then((responses) => {
        setPhotos(responses[0].data);
        setName(responses[1].data.display_name);
        redirectContext.updateLoading(false);
      })
      .catch((err) => {
        redirectContext.updateLoading(false);
        //console.log(err);
        //display error message to the user
      });
  }, [profileID]);

  const [postModalDisplay, setPostModalDisplay] = useState(false);
  const [selectedPost, setSelectedPost] = useState({});

  function closePostModal() {
    setPostModalDisplay(false);
  }
  function presentPostModal(post) {
    setSelectedPost(post);
    setPostModalDisplay(true);
  }

  let displayEditing = (
    <div className={styles.PhotosContainer}>
      {photos.map((photoPost, index) => (
        <div
          key={photoPost.post_id}
          className={styles.PhotoCard}
          onClick={() => presentPostModal(photoPost)}
        >
          <img src={photoPost.link} alt="Not Found" />
        </div>
      ))}
    </div>
  );

  let displayPhotos = (
    <div className={`${"wide-container"}`}>
      <div className={styles.PhotosHeaderContainer}>
        <h1>{name + "'s Photos"}</h1>
      </div>
      {displayEditing}
    </div>
  );

  if (redirectContext.loading) {
    displayPhotos = <Spinner />;
  }

  return (
    <>
      {displayPhotos}
      {/* Modals */}
      <PostModal
        display={postModalDisplay}
        onClose={closePostModal}
        selectedPost={selectedPost}
      />
    </>
  );
}

export default Photos;
