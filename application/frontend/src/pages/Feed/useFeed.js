import { useState, useEffect } from "react";
import axios from "axios";

function useFeed(offset, admin, newPost) {
  const [feedPosts, setFeedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    let cancel;
    if (admin) {
      axios
        .get("/api/posts-admin", { params: { offset } })
        .then((res) => {
          setFeedPosts((prevPosts) => {
            return [...new Set([...prevPosts, ...res.data])];
          });
          setHasMore(res.data.length > 0);
          setLoading(false);
        })
        .catch((res) => {
          setError(true);
        });
    } else {
      axios
        .get("/api/posts", { params: { offset } })
        .then((res) => {
          console.log("feedPosts", feedPosts);
          console.log("res.data: ", res.data);
          console.log("offset: ", offset);
          setFeedPosts((prevPosts) => {
            return [...new Set([...prevPosts, ...res.data])];
          });
          setHasMore(res.data.length > 0);
          setLoading(false);
        })
        .catch((res) => {
          setError(true);
        });
    }
  }, [offset]);

  //Handle when a new post is created by the user
  useEffect(() => {
    let empty = true;
    for (var i in newPost) {
      empty = false;
    }

    if (!empty) {
      setFeedPosts((prevPosts) => {
        return [...new Set([newPost, ...prevPosts])];
      });
    } else {
      console.log("empty");
    }
  }, [newPost]);

  return { loading, error, hasMore, feedPosts };
}

export default useFeed;
