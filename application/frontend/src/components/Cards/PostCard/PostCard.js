//Import Libraries
import {useState} from 'react'
import {Link, useHistory } from "react-router-dom";
import axios from 'axios';

//Import CSS
import styles from './PostCard.module.css'

//Import UI Components

function PostCard({post, innerRef,openPostModal}) {
    console.log('innerRef: ', innerRef)
    const history = useHistory()

    // function likePost(event,feedPostID,index){
    //     if (!event) var event = window.event;
    //     event.cancelBubble = true;
    //     if (event.stopPropagation) event.stopPropagation();
    //     axios.post("/api/like-unlike",{
    //         postToLike: feedPostID
    //     })
    //     .then((response) => {
    //         let updatedPosts = [...feedPosts];
    //         if (response.data === 'like') {
    //         updatedPosts[index].like_count++;
    //         setPosts(updatedPosts);
    //         }
    //         else {
    //             updatedPosts[index].like_count--;
    //             setPosts(updatedPosts);
    //         }
    //     })
    //     .catch((err)=>{
    //         console.log(err);
    //     })
    // }

    function flagPost(event,feedPostID){
        if (!event) var event = window.event;
        event.cancelBubble = true;
        if (event.stopPropagation) event.stopPropagation();
        axios.post("/api/flag-unflag",{
            postToFlag: feedPostID
        })
        .then((response) => {
            console.log(response);
        })
        .catch((err)=>{
            console.log(err);
        })
    }

    function goToProfile(event,profileID){
        //stop from opening post modal
        if (!event) var event = window.event;
        event.cancelBubble = true;
        if (event.stopPropagation) event.stopPropagation();

        const location = {
            pathname: "/Profile/" + profileID,
          }
          history.push(location);
    }

    return (
        <>
        {innerRef ? 
        <div ref={innerRef} key={post.post_id} className={styles["follower-feed-post"]} onClick={(event) => openPostModal(event,post)} >
            <img className={styles["follower-feed-post-prof_pic"]} src={post.profile_pic_link} onClick={(event) => goToProfile(event,post.profile_id)}/>
            <div className={styles["follower-feed-post-name"]} onClick={(event) => goToProfile(event,post.profile_id)}>{post.display_name}</div>
            <div className={styles["follower-feed-post-timestamp"]}>{new Date(post.timestamp).toLocaleString()}</div>
            {/* <div className={styles["follower-feed-post-admin-flags"]}>
                <span className={styles["follower-feed-post-like-count"]}>{post.like_count}</span>
                <img className={styles["follower-feed-post-like-icon"]} src={LikeIcon} onClick={(event) => likePost(event,post.post_id,index)}/>
            </div> */}
            <span className={styles['follower-feed-post-flag']} onClick={(event) => flagPost(event,post.post_id)}>Flag</span>
            {/* <div className={styles["follower-feed-post-comments"]}>10 comments</div> */}
            <div className={styles["follower-feed-post-body"]}>{post.body}</div>
            {post.link && <img className={styles["follower-feed-post-photo"]} src={post.link} />}
        </div> : 
        <div key={post.post_id} className={styles["follower-feed-post"]} onClick={(event) => openPostModal(event,post)} >
            <img className={styles["follower-feed-post-prof_pic"]} src={post.profile_pic_link} onClick={(event) => goToProfile(event,post.profile_id)}/>
            <div className={styles["follower-feed-post-name"]} onClick={(event) => goToProfile(event,post.profile_id)}>{post.display_name}</div>
            <div className={styles["follower-feed-post-timestamp"]}>{new Date(post.timestamp).toLocaleString()}</div>
            {/* <div className={styles["follower-feed-post-admin-flags"]}>
                <span className={styles["follower-feed-post-like-count"]}>{post.like_count}</span>
                <img className={styles["follower-feed-post-like-icon"]} src={LikeIcon} onClick={(event) => likePost(event,post.post_id,index)}/>
            </div> */}
            <span className={styles['follower-feed-post-flag']} onClick={(event) => flagPost(event,post.post_id)}>Flag</span>
            {/* <div className={styles["follower-feed-post-comments"]}>10 comments</div> */}
            <div className={styles["follower-feed-post-body"]}>{post.body}</div>
            {post.link && <img className={styles["follower-feed-post-photo"]} src={post.link} />}
        </div>}
        </>
    )
}

export default PostCard
