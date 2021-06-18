//Import Libraries
import { useState, useEffect, useCallback, useContext, useRef } from "react";
import { Link, useHistory } from "react-router-dom";

import axios from "axios";

//import CSS
import styles from "./Feed.module.css";

//Import UI Components
import PostCard from "../../components/Cards/PostCard/PostCard";
import CreatePostCard from "../../components/Cards/PostCard/CreatePostCard";
import Spinner from "../../components/UI/Spinner/Spinner";
import PostModal from "../../components/Modals/PostModal";

//Import
import useFeed from "./useFeed";
import { RedirectPathContext } from "../../context/redirect-path";

//make this into environment variable before deploying!

function Feed({ appUser }) {
  const history = useHistory();
  if (appUser.role == 4) {
    history.push("/AdminFeed");
  }

  //loading UI
  const [loading, setLoading] = useState(false);

  const redirectContext = useContext(RedirectPathContext);

  const [offset, setOffset] = useState(0);
  const { feedPosts, hasMore, postsLoading, error } = useFeed(offset, false); //custom hook for loading posts
  const [posts, setPosts] = useState([...feedPosts]);

  const [createPostDisplayName, setCreatePostDisplayName] = useState("");
  const [createPostProfilePic, setCreatePostProfilePic] = useState("");

  //storing the pets available to tag in the dropdown menu
  const [taggablePets, setTaggablePets] = useState([]);

  //selectedPost to pass to post modal
  const [selectedPost, setSelectedPost] = useState({});

  const [postModalDisplay, setPostModalDisplay] = useState(false);

  const observer = useRef();

  const lastPostElementRef = useCallback(
    (node) => {
      if (postsLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setOffset((prevOffset) => prevOffset + 10);
        }
      });
      if (node) observer.current.observe(node);
    },
    [postsLoading, hasMore]
  );

  //runs on refresh
  useEffect(() => {
    //get profile pic and name of user  //
    redirectContext.updateLoading(true);

    const getFeedUser = axios.get("/api/feed-user");
    const getFeedUserPets = axios.get("/api/current-user-pets");

    Promise.all([getFeedUser, getFeedUserPets])
      .then((responses) => {
        setCreatePostDisplayName(responses[0].data.display_name);
        setCreatePostProfilePic(responses[0].data.profile_pic_link);

        let taggablePetOptions = [];
        //construct compatible list of options for react-select from backend response
        for (let i = 0; i < responses[1].data.length; i++) {
          taggablePetOptions.push({
            value: responses[1].data[i].pet_id,
            label: responses[1].data[i].display_name,
          });
        }
        setTaggablePets(taggablePetOptions);
        redirectContext.updateLoading(false);
      })
      .catch((err) => {
        redirectContext.updateLoading(false);
        console.log(err);
        //display error message to the user
      });
  }, []);

  function openPostModal(event, feedPost) {
    if (!event) var event = window.event;
    event.cancelBubble = true;
    if (event.stopPropagation) event.stopPropagation();
    setSelectedPost(feedPost);
    setPostModalDisplay(true);
    return;
  }

  function closePostModal() {
    setPostModalDisplay(false);
  }

  return (
    <>
      {redirectContext.loading ? (
        <Spinner />
      ) : (
        <div className={`${styles["follower-feed-container"]} ${"container"}`}>
          <div className={styles["follower-feed-header"]} />
          <CreatePostCard
            displayName={createPostDisplayName}
            profilePic={createPostProfilePic}
            tagOptions={taggablePets}
          />
          {feedPosts.length === 0 && (
            <>
              <div
                className={styles["follower-feed-no-posts-placeholder-header"]}
              >
                No Feed Posts to show :(
              </div>
              <div
                className={styles["follower-feed-no-posts-placeholder-detail"]}
              >
                Search for a User and Follow them to see their posts here
              </div>
            </>
          )}
          {feedPosts &&
            feedPosts.map((feedPost, index) => {
              if (feedPosts.length === index + 1) {
                return (
                  <PostCard
                    innerRef={lastPostElementRef}
                    key={feedPost.post_id}
                    post={feedPost}
                    openPostModal={openPostModal}
                  />
                );
              } else {
                return (
                  <PostCard
                    key={feedPost.post_id}
                    post={feedPost}
                    openPostModal={openPostModal}
                  />
                );
              }
            })}
        </div>
      )}
      <PostModal
        display={postModalDisplay}
        onClose={closePostModal}
        selectedPost={selectedPost}
      />
    </>
  );
}

export default Feed;
